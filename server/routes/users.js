const express = require("express");
const dbUserUtils = require("../libs/dbUserUtils");
const { isEmpty, attempt } = require("../libs/commonUtils");
const path = require("path");
const router = express.Router();

/**
 * Creates automatic functions that help handle "category" URLs, like
 * in this file's case, `/password`, which has subpaths.
 * @param {string} relativePath The path relative to the current router
 * @param {string[]} subpaths A list of subpaths to report back to the requester
 */
function leftover(relativePath, subpaths) {
    router.all(relativePath, function (req, res) {
        console.log(`Reached ${relativePath}`);
        statusReturnJSON(res, 404, {
            error: "Invalid URL",
            title: `Category home for ${req.baseUrl + relativePath}`,
            available_subpaths: subpaths,
        });
    });

    router.all(`${relativePath}/*`, function (req, res) {
        console.log(`Reached ${relativePath}/*`);
        res.redirect(303, req.baseUrl + relativePath);
    });
}

/** Simple function that returns a `405` response for an unallowed method.
 * Example:
 * ```js
 * router.all("/path", methodNotAllowed)
 * ```
 */
function methodNotAllowed(req, res) {
    console.error(
        `Rejecting method ${req.method} for path ${req.baseUrl}${req.path}`
    );
    statusReturn(res, 405, `Method ${req.method} not allowed`);
}

const statusMessages = {
    200: "OK",
    400: "Bad Request",
    404: "Not Found",
    405: "Method not allowed",
    500: "Internal Server Error",
};

/**
 * Returns a status code with additional messages
 * @param {object} res The response object to use for the return
 * @param {int} status The status code to return
 * @param {string} message The message to return. Will attempt to use a default preconfigured message if blank
 * @param {string} secMessage A secondary message to return after the primary (for instance, after a default message)
 */
function statusReturn(
    res,
    status,
    message = undefined,
    secMessage = undefined
) {
    if (isEmpty(message)) {
        if (!(status in statusMessages)) {
            if (!isEmpty(secMessage)) {
                message = `${secMessage}`;
                secMessage = undefined;
            } else
                throw Error(
                    `Specify message for ${status} (none preconfigured)`
                );
        } else message = statusMessages[status];
    }

    if (status < 400)
        console.log(
            `Returning status ${status} with message '${message}` +
                `${isEmpty(secMessage) ? "" : ` - ${secMessage}`}'\n`
        );
    else
        console.error(
            `Returning erroneous status ${status} with message '${message}` +
                `${isEmpty(secMessage) ? "" : ` - ${secMessage}`}'\n`
        );

    return res
        .status(status)
        .send(
            `${status} :: ${message}` +
                `${isEmpty(secMessage) ? "" : ` - ${secMessage}`}`
        );
}

/**
 * Returns a status code with JSONified data.
 * @param {object} res The response object to use for the return
 * @param {int} status The status code to return
 * @param {object} data A JSON-serializable data object.
 */ // Mostly exists for the additional console logging.
function statusReturnJSON(res, status, data) {
    if (status < 400)
        console.log(`Returning status ${status} with JSON data\n`);
    else console.error(`Returning erroneous status ${status} with JSON data\n`);

    return res.status(status).json(data);
}

/**
 * Checks the required parameters for a request and automatically returns a `400` status if one is empty or missing.
 * @param {Request>} req The request object
 * @param {object} res The response object for the request
 * @param {string[]} paramList A list of the required parametes that should be included
 * @param {string} addErrorText *(optional)* Additional text to include with the error
 */
function checkReqParams(req, res, paramList, addErrorText = undefined) {
    for (const item of paramList) {
        if (isEmpty(req.query[item])) {
            return statusReturn(
                res,
                400,
                undefined,
                `Parameter '${item}' is blank or missing. ` +
                    `${isEmpty(addErrorText) ? "" : addErrorText}`
            );
        }
    }
}

/**
 * Checks a session token to ensure it's valid.
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} token *(optional)* A token to check. If none is provided, the `session_token` cookie will be read from the request object.
 * @param {*} userID *(optional)* A userID to check the token against. If none is provided, the `user_ID` cookie will be read from the request object.
 * @returns {Promise<{valid: true; userID: string;} | {valid: false; error: any;}>}
 * An object containing `valid: true | false`, and either `userID: userID` or `error: responseError` respectively.
 */
async function verifyToken(req, res, token = undefined, userID = undefined) {
    //console.log("Cookies:", req.cookies);

    if (isEmpty(token)) token = req.cookies["session_token"];
    if (isEmpty(userID)) userID = req.cookies["user_id"];

    if (isEmpty(token) || isEmpty(userID))
        return {
            valid: false,
            error: statusReturn(
                res,
                401,
                "Either token or userID is missing or corrupt."
            ),
        };

    let task = dbUserUtils.checkSessionToken(token);
    try {
        let taskResult = await task;
        if (!taskResult)
            return {
                valid: false,
                error: statusReturn(
                    res,
                    401,
                    "Session token in cookie is expired or invalid"
                ),
            };
        let belongsToAdmin;
        if (
            taskResult != userID ||
            !(belongsToAdmin = await isAdmin(taskResult))
        )
            return {
                valid: false,
                error: statusReturn(
                    res,
                    403,
                    "User ID in cookie does not match token, or is not admin-level"
                ),
            };
        console.log(
            "Token is valid -",
            belongsToAdmin ? "is admin-level" : "matches provided user ID"
        );
        return { valid: true, userID: taskResult };
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return {
                valid: false,
                error: statusReturn(
                    res,
                    error.statusCode,
                    undefined,
                    error.message
                ),
            };
        return { valid: false, error: statusReturn(res, 500) };
    }
}

/**
 * Checks if the user provided is of admin-level or not
 * @param {string} id The ID of the user to check
 * @returns `true` or `false`
 */
async function isAdmin(id) {
    let getTask = dbUserUtils.getUserData(id, "isAdmin");
    try {
        let taskResult = await getTask;
        if (!taskResult) return false;
        return true;
    } catch (error) {
        console.error(error);
        return;
    }
}

let categoryURLs = {};

router.post("/create", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/create`);

    // No parameter checking (too many to track), the function will return the necessary error as needed

    let task = dbUserUtils.createUser(req.query);
    try {
        let taskResult = await task;
        return statusReturnJSON(res, 200, { id: taskResult });
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return statusReturn(
                res,
                error.statusCode,
                undefined,
                error.message
            );
        return statusReturn(res, 500);
    }
});

router.get("/get-whole", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/get-whole`);

    let checkError = checkReqParams(req, res, ["iden"]);
    if (checkError) return checkError;

    let tokenCheck = await verifyToken(req, res);
    if (!tokenCheck.valid) return tokenCheck.error;

    let task = dbUserUtils.getUserWhole(req.query.iden, req.query.idenForm);
    try {
        let taskResult = await task;
        if (!taskResult)
            return statusReturn(
                res,
                404,
                "Could not find user with " +
                    `${req.query.idenForm || "id"} '${req.query.iden}'`
            );
        return statusReturnJSON(res, 200, taskResult);
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return statusReturn(
                res,
                error.statusCode,
                undefined,
                error.message +
                    ' \n[[Hint: idenForm parameter can be "id" or "email"]]'
            );
        return statusReturn(res, 500);
    }
});

router.put("/update-whole", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/update-whole`);

    // No parameter checking (too many to track), the function will return the necessary error as needed

    let tokenCheck = await verifyToken(req, res);
    if (!tokenCheck.valid) return tokenCheck.error;

    let task = dbUserUtils.updateUserWhole(req.query);
    try {
        await task;
        return statusReturn(res, 200, "User updated");
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return statusReturn(
                res,
                error.statusCode,
                undefined,
                error.message
            );
        return statusReturn(res, 500);
    }
});

router.put("/add-data", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/add-data`);

    let checkError = checkReqParams(req, res, ["id", "fieldName"]);
    if (checkError) return checkError;

    let tokenCheck = await verifyToken(req, res);
    if (!tokenCheck.valid) return tokenCheck.error;

    let task = dbUserUtils.addUserData(
        req.query.id,
        req.query.fieldName,
        req.query.data,
        attempt(() => JSON.parse(req.query.intoArray)),
        attempt(() => JSON.parse(req.query.replace))
    );
    try {
        await task;
        return statusReturn(
            res,
            200,
            `Data ${
                attempt(() => JSON.parse(req.query.replace), true)
                    ? "replaced"
                    : "added"
            } for field ${req.query.fieldName}`
        );
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return statusReturn(
                res,
                error.statusCode,
                undefined,
                error.message
            );
        return statusReturn(res, 500);
    }
});

router.get("/get-data", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/get-data`);

    let checkError = checkReqParams(req, res, ["id", "fieldNames"]);
    if (checkError) return checkError;

    let tokenCheck = await verifyToken(req, res);
    if (!tokenCheck.valid) return tokenCheck.error;

    let task = dbUserUtils.getUserData(req.query.id, req.query.fieldNames);
    try {
        let taskResult = await task;
        return statusReturnJSON(res, 200, taskResult);
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return statusReturn(
                res,
                error.statusCode,
                undefined,
                error.message
            );
        return statusReturn(res, 500);
    }
});

router.delete("/remove-data", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/remove-data`);

    let checkError = checkReqParams(req, res, ["id", "fieldName"]);
    if (checkError) return checkError;

    let tokenCheck = await verifyToken(req, res);
    if (!tokenCheck.valid) return tokenCheck.error;

    let task = dbUserUtils.removeUserData(req.query.id, req.query.fieldName);
    try {
        await task;
        return statusReturn(
            res,
            200,
            `Field '${req.query.fieldName}' removed from user ${req.query.id}`
        );
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return statusReturn(
                res,
                error.statusCode,
                undefined,
                error.message
            );
        return statusReturn(res, 500);
    }
});

router.delete("/destroy", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/destroy`);

    let checkError = checkReqParams(req, res, ["id"]);
    if (checkError) return checkError;

    let tokenCheck = await verifyToken(req, res);
    if (!tokenCheck.valid) return tokenCheck.error;

    let task = dbUserUtils.destroyUser(req.query.id);
    try {
        await task;
        return statusReturn(res, 200, "User destroyed");
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return statusReturn(
                res,
                error.statusCode,
                undefined,
                error.message
            );
        return statusReturn(res, 500);
    }
});

router.get("/password/check", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/password/check`);

    let checkError = checkReqParams(req, res, ["id", "password"]);
    if (checkError) return checkError;

    let tokenCheck = await verifyToken(req, res);
    if (!tokenCheck.valid) return tokenCheck.error;

    let task = dbUserUtils.checkPassword(req.query.id, req.query.password);
    try {
        let taskResult = await task;
        if (!taskResult) return statusReturn(res, 403, "Password check failed");
        return statusReturn(res, 200, "Password match");
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return statusReturn(
                res,
                error.statusCode,
                undefined,
                error.message
            );
        return statusReturn(res, 500);
    }
});

router.put("/password/change", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/password/change`);

    let checkError = checkReqParams(req, res, ["id", "newPassword"]);
    if (checkError) return checkError;

    let tokenCheck = await verifyToken(req, res);
    if (!tokenCheck.valid) return tokenCheck.error;

    let task = dbUserUtils.changePassword(req.query.id, req.query.newPassword);
    try {
        await task;
        return statusReturn(res, 200, "Password changed");
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return statusReturn(
                res,
                error.statusCode,
                undefined,
                error.message
            );
        return statusReturn(res, 500);
    }
});

categoryURLs["/password"] = ["/check", "/change"];

router.get("/session/create", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/session/create`);

    let checkError = checkReqParams(req, res, ["iden", "password"]);
    if (checkError) return checkError;

    let task = dbUserUtils.createSessionToken(
        req.query.iden,
        req.query.password,
        req.query.idenForm,
        parseFloat(req.query.expiresInHours) || undefined
    );
    try {
        let taskResult = await task;

        // Essentially renames the key "_id" to "_token"
        taskResult = { token: taskResult._id, ...taskResult };
        delete taskResult._id;

        res.cookie("session_token", taskResult.token, {
            expires: taskResult.expiry,
        });
        res.cookie("user_id", taskResult.userID, {
            expires: taskResult.expiry,
        });
        return statusReturnJSON(res, 200, taskResult);
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return statusReturn(
                res,
                error.statusCode,
                undefined,
                error.message +
                    ' \n[[Hint: idenForm parameter can be "id" or "email"]]'
            );
        return statusReturn(res, 500);
    }
});

router.get("/session/check", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/session/check`);
    let token;

    // Manual param check with fallback instead of checkReqParams()
    if (
        isEmpty((token = req.query.token)) &&
        isEmpty((token = req.cookies.session_token))
    )
        return statusReturn(
            res,
            400,
            undefined,
            `Parameter 'token' is blank or missing. ` +
                "Fallback failed: No session token present in cookies"
        );

    let tokenCheck = await verifyToken(req, res);
    if (!tokenCheck.valid) return tokenCheck.error;

    let task = dbUserUtils.checkSessionToken(token);
    try {
        let taskResult = await task;
        if (!taskResult) {
            res.cookie("session_token", "", { maxAge: 1000 /*ms*/ });
            res.cookie("user_id", "", { maxAge: 1000 /*ms*/ });
            return statusReturn(res, 410, "Token expired or invalid");
        }
        return statusReturnJSON(res, 200, {
            message: "Token valid",
            userID: taskResult,
        });
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return statusReturn(
                res,
                error.statusCode,
                undefined,
                error.message
            );
        return statusReturn(res, 500);
    }
});

router.delete("/session/expire", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/session/expire`);
    let token;

    // Manual param check with fallback instead of checkReqParams()
    if (
        isEmpty((token = req.query.token)) &&
        isEmpty((token = req.cookies.session_token))
    )
        return statusReturn(
            res,
            400,
            undefined,
            `Parameter 'token' is blank or missing. ` +
                "Fallback failed: No session token present in cookies"
        );

    let tokenCheck = await verifyToken(req, res);
    if (!tokenCheck.valid) return tokenCheck.error;
    let task = dbUserUtils.expireSessionToken(token);
    try {
        await task;
        res.cookie("session_token", "", { maxAge: 1000 /*ms*/ });
        res.cookie("user_id", "", { maxAge: 1000 /*ms*/ });
        return statusReturn(res, 200, "Token deleted if exists");
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return statusReturn(
                res,
                error.statusCode,
                undefined,
                error.message
            );
        return statusReturn(res, 500);
    }
});

categoryURLs["/session"] = ["/create", "/check", "/expire"];

// Base route
router.get("/", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/ (root)`);
    return res.status(300).sendFile(path.join(__dirname, "/docs/user.html"));
    //Create base code
});

// Default route
router.get("/*", async (req, res) => {
    console.error(
        `Attempted to reach non-existent path at ${req.baseUrl}${req.path}`
    );
    console.log(`Caught under ${req.baseUrl}/*`);
    return statusReturn(
        res,
        404,
        "Page not found",
        "See /api/users for possible paths"
    );
});

// For all routes configured here, if any other method, return a 405 reponse
router.stack.forEach((item) => {
    router.all(item.route.path, methodNotAllowed);
});

// Configure categoryURLs with appropriate JSON response.
Object.keys(categoryURLs).forEach((category) => {
    leftover(category, categoryURLs[category]);
});

module.exports = router;
