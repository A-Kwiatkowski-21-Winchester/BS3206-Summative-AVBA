const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Lib imports
const dbconnect = require("./dbconnect");
const security = require("./security");
const { isEmpty, isValidDate, isSemEqual } = require("./commonUtils");

// Constants
const dbName = "Users";
const userDataCollection = "UserData";
const userTokenCollection = "UserTokens";
const idPrefix = "AH-";
const idRegex = /[_]?id/i;

// Custom Error
class RequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "RequestError";
    }
}

//#region Internal tools

/** Generates and opens a dbconnect client. */
function prepClient() {
    dbconnect.generateClient();
    dbconnect.openClient();
}

/** Gets a specific database collection. */
function getCollection(name) {
    let collection = dbconnect.globals.client.db(dbName).collection(name);
    return collection;
}

/**
 * Generates an ID number by hashing a provided string, then converting the hash result to decimal.
 * @param {string}  comboString The message to be turned into an ID. To prevent collision,
 *                              this should be something like "`<name><DOB><email>`"
 * @param {int}     truncation  *(optional)* The length of the returned value. Default is `9`.
 * @param {boolean} numeric     *(optional)* If the returned value should be numeric (decimal).
 *                              If `false`, returned value will be a hash. Default is `true`.
 */
function generateID(comboString, truncation = 9, numeric = true) {
    let fullHash = crypto.createHash("md5").update(comboString).digest("hex");
    let shortHash = fullHash.slice(0, truncation);
    if (!numeric) return shortHash;
    let convertInt = Number.parseInt(shortHash, 16);
    let shortInt = convertInt.toString().slice(0, truncation);
    return shortInt;
}

/**
 * Bcrypt hashes and encrypts a password using environment secret key.
 * @param {string} password The password to secure. Preferably simply hashed already but will accept plaintext.
 * @param {boolean} superuser *(optional)* Whether to use "superuser"-level hashing for the string. Default is `false`.
 * @param {boolean} cipherAsString *(optional)* Whether to return the cipher as a precombined string. Default is `true`.
 * @returns {string|CipherObject} A precomibined cipherstring, or a CipherObject containing the encrypted pieces
 */
function securePassword(password, superuser = false, cipherAsString = true) {
    let bcryptHashedPassword = security.hashString(password, superuser);
    if (cipherAsString) {
        let cipherString = security.encryptStringFull(bcryptHashedPassword);
        return cipherString;
    }
    let cipherObj = security.encryptString(bcryptHashedPassword);
    return cipherObj;
}

/**
 * Gets the stored (encrypted) password value for a user.
 * @param {string} id The ID of the user to fetch the password for.
 * @returns {Promise<string|null>} The password as a string (though not as plaintext).
 */
async function getPassword(id) {
    if (isEmpty(id)) throw new RequestError("No ID provided to get user with.");
    prepClient();
    let getPromise = getCollection(userDataCollection).findOne(
        { _id: id },
        {
            projection: {
                _id: 0,
                password: 1,
            },
        }
    );
    getPromise.finally(() => dbconnect.closeClient());
    let promiseResult = await getPromise;
    if (!promiseResult)
        throw new RequestError(
            `User with ID '${id}' does not exist. Could not get password.`
        );
    return promiseResult.password;
}

/**
 * Contains the required fields for the creation of a new user.
 * Format: `<field>: [<type>, <hint>]`
 */
const requiredFields = {
    title: ["string"],
    firstName: ["string"],
    lastName: ["string"],
    dob: ["object", "uses Date object"],
    sex: ["number", "uses dbUserUtils.sex enum"],
    email: ["string"],
    password: ["string", "should be pre-hashed using SHA-256"],
    phone: ["string"],
    isAdmin: ["boolean"],
};

/**
 * Checks a UserObject's fields to ensure it:
 * - Has all the required fields, and
 * - Fields like `sex` and `dob` follow the correct format
 * @param {object} userObject
 */
function checkUserReqFields(userObject) {
    for (const field of Object.keys(requiredFields)) {
        // If field does not exist
        if (isEmpty(userObject[field]))
            throw new RequestError(`Field '${field}' is required but was not found.`);

        // If field does not match required type
        if (typeof userObject[field] != requiredFields[field][0]) {
            let errorStr =
                `Field '${field}' was not of required type '${requiredFields[field][0]}'` +
                ` (was instead '${typeof userObject[field]}').`;
            if (field == "sex")
                errorStr += ` For field '${field}', use the dbUserUtils.sex enum.`;
            if (field == "dob")
                errorStr += ` For field '${field}', use the Date class.`;
            throw new RequestError(errorStr);
        }
    }

    if (!isValidDate(userObject["dob"]))
        throw new RequestError(`Date for 'dob' is invalid.`);
}

//#endregion

/**
 * Enum for user sex
 * @readonly
 * @enum {number}
 */
const sex = Object.freeze({
    MALE: 0,
    FEMALE: 1,
    OTHER: 2,
});

/**
 * @returns A stringified list of the required fields needed to create a new user.
 * @see {@linkcode createUser()}
 */
function listRequiredFields() {
    return JSON.stringify(requiredFields);
}

/**
 * Creates a new user on the database.
 * @param {object} userObject A dictionary containing the values to insert for the new user.
 * The `password` value should be hashed client-side before being passed to the server;
 * it will be re-hashed and encrypted before storage.
 * To see the minimum required fields and their types, run:
 * ```javascript
 * // Import dbUserUtils, then:
 * console.log(dbUserUtils.listRequiredFields())
 * ```
 * or see {@link requiredFields}.
 * @returns {number} The ID of the newly created user.
 * @throws Various `Error`s when fields are missing or invalid.
 */
function createUser(userObject) {
    // If "(_)id" key is anywhere in the userObject
    if (Object.keys(userObject).find((key) => key.match(idRegex)))
        throw new RequestError(
            "ID should not be included in new user data; it is generated automatically. " +
                "If this is an existing user, use updateUserWhole()."
        );

    checkUserReqFields(userObject);

    let genID =
        idPrefix +
        generateID(
            userObject.firstName +
                userObject.lastName +
                userObject.dob.toString() +
                userObject.email +
                "-AVBA"
        );
    userObject["_id"] = genID;

    userObject.password = securePassword(userObject.password);

    console.log("Inserting into DB...");
    prepClient();
    let insertPromise = getCollection(userDataCollection).insertOne(userObject);
    insertPromise.finally(() => dbconnect.closeClient());
    insertPromise.then(() => console.log("Insertion complete."));
}

/**
 * Retrieves an entire userObject, with all data properties
 * @param {string} identifier
 * @param {"_id"|"email"} identifierForm
 * @returns A Promise which will resolve to a userObject document.
 */
async function getUserWhole(identifier, identifierForm = "_id") {
    if (isEmpty(identifier)) throw new RequestError("No ID provided to get user with.");
    let validIDForms = ["_id", "email"];
    if (!validIDForms.includes(identifierForm))
        throw new RequestError(
            `Invalid identifier form (should be one of: ${validIDForms})`
        );
    prepClient();
    let filter = { [identifierForm]: identifier };
    let findPromise = getCollection(userDataCollection).findOne(filter);
    findPromise.finally(() => dbconnect.closeClient());
    return await findPromise;
}

/**
 * **Not Recommended**
 * Updates an entire user, replacing the database copy with the one provided.
 * The `password` property will not replaced and the database value will remain - use {@linkcode changePassword()} to change passwords.
 * @param {object} userObject The userObject to replace the user with in the database. Must contain required fields.
 */
async function updateUserWhole(userObject) {
    if (isEmpty(userObject["_id"]))
        throw new RequestError(
            "No '_id' found in userObject; one should be included to update user. " +
                "If this is a new user, use createUser() ."
        );
    checkUserReqFields(userObject);

    let userPassword = await getPassword(userObject._id);
    userObject.password = userPassword; // Replaces any manually set password with one from the database.

    prepClient();
    let updatePromise = getCollection(userDataCollection).findOneAndReplace(
        { _id: userObject.id },
        userObject
    );
    updatePromise.finally(() => dbconnect.closeClient());
    let promiseResult = await updatePromise;
    if (!promiseResult)
        throw new RequestError(
            `User with ID '${userObject.id}' does not exist. Could not update.`
        );
}

/**
 * Adds (or replaces) a piece of user data, including custom data.
 * @param {string} id The ID of the user to update the data on.
 * @param {string} fieldName The name of the field to update the value for.
 * @param {Array|object} data The value (or array of values) to be added (or replaced with).
 * @param {boolean} intoArray *(optional)* Whether data should be added to field array (default `false`).
 * - `false` if the field should contain a singular value.
 * - `true` if the field should contain an array of values.
 * If `replace` is `false`, and the existing data is not already in array form, an extra database operation will be
 * expended to automatically convert the existing singular value to an array before adding the data.
 * @param {boolean} replace *(optional)* Whether the provided data should replace the existing data (default `true`).
 * If this parameter and `intoArray` are both `false`, this command will **fail** (no way to *not* replace a singular value).
 */
async function addUserData(
    id,
    fieldName,
    data,
    intoArray = false,
    replace = true
) {
    if (isEmpty(id)) throw new RequestError("ID is required but was not provided.");
    if (isEmpty(fieldName))
        throw new RequestError("fieldName is required but was not provided.");
    if (isEmpty(data))
        throw new RequestError(
            "Data is required but was not provided. To remove data, use removeUserData()"
        );
    if (!intoArray && !replace)
        throw new RequestError(
            "Parameters intoArray and replace cannot both be false simultaneously " +
                "(no way to not replace a singular value)."
        );
    if (fieldName.match(idRegex)) throw new RequestError("Field 'ID' cannot be changed.");
    if (isSemEqual(fieldName, "password"))
        throw new RequestError(
            "Field 'password' cannot be changed this way. " +
                "Use changePassword()."
        );

    let action = "$set";
    if (intoArray) if (!Array.isArray(data)) data = [data]; // If not array, convert to array
    let dataAction = { [fieldName]: data };
    if (!replace) {
        action = "$push";
        if (intoArray) dataAction = { [fieldName]: { $each: data } };
    }
    let updateFilter = { [action]: dataAction };

    prepClient();
    let updatePromise = getCollection(userDataCollection).findOneAndUpdate(
        { _id: id },
        updateFilter
    );
    let promiseResult;
    try {
        promiseResult = await updatePromise;
    } catch (error) {
        // If not an array error, re-throw it
        if (!error.message.includes("must be an array")) throw error;
        console.log(
            "Existing data is not already in array structure, converting..."
        );
        let convertUpdatePromise = getCollection(
            userDataCollection
        ).findOneAndUpdate({ _id: id }, [
            // ↓ Uses $set (aggregation) to use existing value (updateFilter is in [ ])
            { $set: { [fieldName]: [`$${fieldName}`].concat(data) } },
        ]);
        promiseResult = await convertUpdatePromise;
    } finally {
        dbconnect.closeClient();
    }

    if (!promiseResult)
        throw new RequestError(`User with ID '${id}' does not exist. Could not update.`);
    console.log(`Updated data in field ${fieldName} for user with id '${id}'.`);
}

/**
 * Gets the value of a field from a user.
 * @param {string} identifier An identifier for the user, typically the ID.
 * @param {string|string[]} fieldNames Which field(s) to retrieve the value(s) for.
 * @param {"_id"|"email"} identifierForm What the identifier parameter represents (default `"_id"`).
 * `"_id"` is recommended, as it is guaranteed to be unique. If `"email"` is used, it will return the first match.
 * @returns A Promise which will resolve to an object containing the requested value(s). If the resolved value is `null`,
 * either the identifier matched no users, or the field did not exist.
 */
async function getUserData(identifier, fieldNames, identifierForm = "_id") {
    let validIDForms = ["_id", "email"];
    if (!validIDForms.includes(identifierForm))
        throw new RequestError(
            `Invalid identifier form (should be one of: ${validIDForms})`
        );
    if (!Array.isArray(fieldNames)) fieldNames = [fieldNames]; // If not array, convert to array
    let projectionObj = {
        _id: 0,
    };
    fieldNames.forEach((fieldName) => {
        if (isSemEqual(fieldName, "password"))
            throw new RequestError(
                "Field 'password' is encrypted and should not be retrieved this way. " +
                    "To check a value against the stored password, use checkPassword()."
            );
        projectionObj[fieldName] = 1;
    });

    prepClient();
    let getPromise = getCollection(userDataCollection).findOne(
        { [identifierForm]: identifier },
        { projection: projectionObj }
    );
    getPromise.finally(() => dbconnect.closeClient());
    return await getPromise;
}

/**
 * Removes a field and its data from a user.
 * @param {string} id The ID of the user to remove data from
 * @param {string} fieldName The name of the field to remove from the user.
 */
async function removeUserData(id, fieldName) {
    if (isEmpty(id)) throw new RequestError("ID is required but was not provided.");
    if (isEmpty(fieldName))
        throw new RequestError("fieldName is required but was not provided.");
    if (fieldName.match(idRegex) || fieldName in requiredFields)
        throw new RequestError(`Field '${fieldName}' is required and cannot be removed.`);

    prepClient();
    let updatePromise = getCollection(userDataCollection).findOneAndUpdate(
        { _id: id },
        { $unset: { [fieldName]: "" } }
    );

    updatePromise.finally(() => dbconnect.closeClient());
    let promiseResult = await updatePromise;

    if (!promiseResult)
        throw new RequestError(`User with ID '${id}' does not exist. Could not update.`);
    if(isEmpty(promiseResult[fieldName]))
        throw new RequestError(`No field found with name '${fieldName}' on user ${id}. Could not remove.`)
    console.log(`Removed data in field ${fieldName} for user with id '${id}'.`);
}

/**
 * Destroys a user record from the database. Irreversible.
 * @param {string} id The ID of the user to destroy.
 */
async function destroyUser(id) {
    if (isEmpty(id)) throw new RequestError("ID is required but was not provided.");
    prepClient();
    let destroyPromise = getCollection(userDataCollection).findOneAndDelete({
        _id: id,
    });
    destroyPromise.finally(() => dbconnect.closeClient());
    let promiseResult = await destroyPromise;
    if (!promiseResult)
        throw new RequestError(`User with ID '${id}' does not exist. Could not destroy.`);
    console.log(`Destroyed user with id '${id}'.`);
}

/**
 * Checks a password value against the encrypted value stored in the database.
 * @param {string} id The ID of the user whose password to check against.
 * @param {string} password The password to check against the one stored in the database.
 * Preferably already SHA-256 hashed by the client.
 * @returns A Promise which resolves to `true` if the password matches.
 */
async function checkPassword(id, password) {
    if (isEmpty(id)) throw new RequestError("ID is required but was not provided.");
    if (isEmpty(password))
        throw new RequestError(
            "Password is required for comparison but was not provided."
        );

    prepClient();

    let compareResult;
    try {
        let encUserPass = await getPassword(id);
        let hashUserPass = security.decryptStringFull(encUserPass);
        compareResult = bcrypt.compareSync(password, hashUserPass);
    } catch (error) {
        console.error("Password check: ", error.message);
        throw new RequestError(
            "There is a problem with the currently set user password. " +
                "Use changePassword() to set this user's password again."
        );
    }
    return compareResult;
}

/**
 * Changes the password of a user, encrypting it before storage.
 * @param {string} id The ID of the user whose password to change.
 * @param {string} newPassword The new password for the user. Preferably already SHA-256 hashed by the client.
 */
async function changePassword(id, newPassword) {
    if (isEmpty(id)) throw new RequestError("ID is required but was not provided.");
    if (isEmpty(newPassword))
        throw new RequestError("newPassword is required but was not provided.");

    let encPassword = securePassword(newPassword);
    prepClient();
    let updatePromise = getCollection(userDataCollection).findOneAndUpdate(
        { _id: id },
        { $set: { password: encPassword } }
    );
    let promiseResult = await updatePromise;
    if (!promiseResult)
        throw new RequestError(
            `User with ID '${id}' does not exist. Could not change password.`
        );
    console.log(`Password successfully changed for user '${id}'`);
}

/**
 * Creates a session token that can be stored in the browser to maintain a logged in session.
 * @param {string} identifier An identifier for the user, typically the email.
 * @param {string} password The password for the specified user (preferably already SHA-256 hashed). Is checked before token is generated.
 * @param {"email"|"_id"} identifierForm What the identifier parameter represents (default `"email"`).
 * @param {number} expiresInHours How many hours until the token expires. Default is `1`.
 * @returns A Promise that resolves to the generated token string.
 */
async function createSessionToken(
    identifier,
    password,
    identifierForm = "email",
    expiresInHours = 1
) {
    let validIDForms = ["_id", "email"];
    if (!validIDForms.includes(identifierForm))
        throw new RequestError(
            `Invalid identifier form (should be one of: ${validIDForms})`
        );
    if (identifierForm == "email") {
        let id = await getUserData(identifier, "_id", identifierForm);
        if (!id)
            throw new RequestError(
                `User could not be found for email '${identifier}'. Unable to create token.`
            );
        identifier = id._id;
    }

    let passCheck = await checkPassword(identifier, password).catch((error) => {
        console.error("Could not generate token.");
        throw error;
    });
    if (!passCheck)
        throw new RequestError(
            `Password did not match for user with identifier '${identifier}'. Unable to create token.`
        );

    let preToken = identifier + new Date().toString();
    let genToken = crypto.createHash("sha-256").update(preToken).digest("hex");
    //                    hrs        min  sec   ms
    let hoursInMs = expiresInHours * 60 * 60 * 1000;
    let expiryTime = new Date(Date.now() + hoursInMs);

    let tokenObject = {
        _id: genToken,
        userID: identifier,
        expiry: expiryTime,
    };

    prepClient();
    let insertPromise =
        getCollection(userTokenCollection).insertOne(tokenObject);
    insertPromise.finally(() => dbconnect.closeClient());
    let promiseResult = await insertPromise;
    if (!promiseResult) throw new RequestError("Unknown failure. Token not generated.");
    console.log(`Token generated for user '${identifier}'.`);
    return genToken;
}

/**
 * Verifies if a session token exists, and if it is in-date.
 * @param {string} token The token to verify
 * @returns A Promise which resolves to `true` if the token is valid.
 */
async function checkSessionToken(token) {
    if (isEmpty(token)) throw new RequestError("Token is required but was not provided.");

    prepClient();
    let getPromise = getCollection(userTokenCollection).findOne({ _id: token });
    getPromise.finally(() => dbconnect.closeClient());
    let promiseResult = await getPromise;
    //Non-existent token is the same as an expired token.
    if (!promiseResult) return false;

    let tokenExpiry = promiseResult.expiry;

    // If expiry is before now (i.e. expired) - invalid
    if (tokenExpiry <= new Date()) return false;
    // Otherwise, token is valid
    return true;
}

/**
 * Forcibly expires (i.e. deletes) a session token on the database.
 * @param {string} token
 */
function expireToken(token) {
    if (isEmpty(token)) throw new RequestError("Token is required but was not provided.");

    prepClient();
    let deletePromise = getCollection(userTokenCollection).findOneAndDelete({
        _id: token,
    });
    let trunc_token = token.slice(0, 7);
    deletePromise.then((result) => {
        if (!result)
            console.error(
                `Token '${trunc_token}(...)' could not be found. Unable to expire.`
            );
        else console.log(`Token '${trunc_token}(...)' expired successfully.`);
    });
    deletePromise.catch((error) => {
        console.error(
            `Error: token '${trunc_token}(...)' may not have been deleted.`
        );
        throw error;
    });
    deletePromise.finally(() => dbconnect.closeClient());
}

module.exports = {
    RequestError,
    sex,
    listRequiredFields,
    createUser,
    getUserWhole,
    updateUserWhole,
    addUserData,
    getUserData,
    removeUserData,
    destroyUser,
    checkPassword,
    changePassword,
    createSessionToken,
    checkSessionToken,
    expireToken,
};
