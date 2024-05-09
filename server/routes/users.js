const express = require("express");
const dbUserUtils = require("../libs/dbUserUtils");
const { isEmpty } = require("../libs/commonUtils");
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
        res.status(404).json({
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
 * Returns a status code
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
        if (!(status in statusMessages))
            throw Error(`Specify message for ${status} (none preconfigured)`);
        message = statusMessages[status];
    }

    if (status < 400)
        console.log(
            `Returning status ${status} with message '${message}` +
                `${isEmpty(secMessage) ? "" : ` - ${secMessage}`}'`
        );
    else
        console.error(
            `Returning erroneous status ${status} with message '${message}` +
                `${isEmpty(secMessage) ? "" : ` - ${secMessage}`}'`
        );

    return res
        .status(status)
        .send(
            `${status} :: ${message}` +
                `${isEmpty(secMessage) ? "" : ` - ${secMessage}`}`
        );
}

/**
 * Checks the required parameters for a request and automatically returns a `400` status if one is empty or missing.
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>>} req The request object
 * @param {object} res The response object for the request
 * @param {string[]} paramList A list of the required parametes that should be included
 */
function checkReqParams(req, res, paramList) {
    return paramList.every((item) => {
        if (isEmpty(req.query[item]))
            return statusReturn(
                res,
                400,
                null,
                `Parameter '${item}' is blank or missing`
            );
        return false;
    });
}

let categoryURLs = {};

//TODO: Add session token checking for (nearly) all methods

router.post("/create", function (req, res) {
    console.log(`Reached ${req.baseUrl}/create`);
    //TODO: Add create function
});

router.get("/get-whole", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/get-whole`);
    //TODO: Add getWhole function
});

router.put("/update-whole", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/update-whole`);
    //TODO: Add update-whole function
});

router.put("/add-data", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/add-data`);
    //TODO: Add add-data function
});

router.get("/get-data", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/get-data`);
    //TODO: Add get-data function
});

router.delete("/remove-data", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/remove-data`);

    let checkError = checkReqParams(req, res, ["id", "fieldName"]);
    if (checkError) return checkError;

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
            return statusReturn(res, 400, "", error.message);
        return statusReturn(res, 500);
    }
});

router.delete("/destroy", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/destroy`);

    let checkError = checkReqParams(req, res, ["id"]);
    if (checkError) return checkError;

    let task = dbUserUtils.destroyUser(req.query.id);
    try {
        await task;
        return statusReturn(res, 200, "User destroyed");
    } catch (error) {
        console.error(error);
        if (error instanceof dbUserUtils.RequestError)
            return statusReturn(res, 400, "", error.message);
        return statusReturn(res, 500);
    }
});

router.get("/password/check", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/password/check`);
    //TODO: Add password check function
});

router.put("/password/change", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/password/change`);
    //TODO: Add password change function
});

categoryURLs["/password"] = ["/check", "/change"];

router.get("/session/get", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/session/get`);
    //TODO: Add session get function
});

router.get("/session/check", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/session/check`);
    //TODO: Add session check function
});

router.delete("/session/expire", async (req, res) => {
    console.log(`Reached ${req.baseUrl}/session/expire`);
    //TODO: Add session expire function
});

categoryURLs["/session"] = ["/get", "/check", "/expire"];

// Default route
router.get("/", async (req, res) => {
    //Create base code
    console.log("User API");
    res.json({ message: "Page!" });
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
