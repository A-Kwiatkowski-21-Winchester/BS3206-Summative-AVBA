let dbconnect = require("./dbconnect");
let { md5 } = require("js-md5");
let bcrypt = require("bcrypt");
let crypto = require("crypto");

// Constants
const dbName = "Users";
const collectionName = "UserData";
const idPrefix = "AH-";

let env;
try {
    env = require("../env/environment");
} catch {
    throw Error(
        "Unable to load './env/environment.js'. Have you filled out a copy of the template and renamed it?"
    );
}

//#region Internal tools

/**
 * Generates and opens a dbconnect client.
 */
function prepClient() {
    dbconnect.generateClient();
    dbconnect.openClient();
}

/**
 * @param {Date} date The date object to test
 * @returns `true` or `false`, depending if the date is valid or not
 */
function isValidDate(date) {
    return (
        date && // Is value truthy
        Object.prototype.toString.call(date) === "[object Date]" && // Is the object a Date
        !isNaN(date) // Is the date valid
    );
}

function isEmpty(string) {
    return string == undefined || string === "";
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
    let fullHash = md5.hex(comboString);
    let shortHash = fullHash.slice(0, truncation);
    if (!numeric) return shortHash;
    let convertInt = Number.parseInt(shortHash, 16);
    let shortInt = convertInt.toString().slice(0, truncation);
    return shortInt;
}

/** The work factor for the bcrypt hash (for regular user). */
const hashWorkFactor = 12;

/**
 * Hashes a string using bcrypt.
 * @param {string} string The plaintext string to be hashed.
 * @param {boolean} superuser *(optional)* Whether to use "superuser"-level work factor for hashing. Default is `false`.
 * @returns A bcrypt hash in the format '`$<ver>$<rounds>$<saltVal(22)><hashVal>`'. Store this all together.
 */
function hashString(string, superuser = false) {
    let saltRounds = hashWorkFactor;
    if (superuser) saltRounds += 2; // Would increase 250ms of work time to 1s (*4)
    let startTime = new Date();
    let hashString = bcrypt.hashSync(string, saltRounds);
    let endTime = new Date();
    console.log(`Hashing took ${endTime - startTime}ms`);
    return hashString;
}

/**
 * Encrypts a string using AES-256(-GCM), using the secret key configured in `environment.js`.
 * @param {string} plaintext The string to be encrypted.
 * @returns {object} An object containing: `ciphertext`, `iv`, and `tag`.
 * For a precombined string, use `encryptStringFull()`.
 */
function encryptString(plaintext) {
    if (!env.secretKey)
        throw Error("'secretKey' not configured in environment.js .");
    if (isEmpty(plaintext)) throw Error("Cannot encrypt empty plaintext.");
    let keyBytes = Buffer.from(env.secretKey, "base64");
    let iv = crypto.randomBytes(16).toString("base64");
    let cipherer = crypto.createCipheriv("aes-256-gcm", keyBytes, iv);
    let ciphertext = cipherer.update(plaintext, "utf-8", "base64"); // Add string to be encrypted
    ciphertext += cipherer.final("base64"); // Finalise the encryption
    let tag = cipherer.getAuthTag().toString("base64");
    return { ciphertext, iv, tag };
}

/**
 * Encrypts a string using AES-256(-GCM), using the secret key configured in `environment.js`.
 * @param {string} plaintext The string to be encrypted.
 * @returns {string} A precombined string in the format: '`<ciphertext>;<iv>;<tag>`'.
 * For a separated object, use `encryptString()`.
 */
function encryptStringFull(plaintext) {
    let cipherObject = encryptString(plaintext);
    fullCipherString = Object.values(cipherObject).join(";");
    return fullCipherString;
}

/**
 * Decrypts a string using AES-256(-GCM), using the secret key configured in `environment.js`.
 * Accepts the ciphertext, iv, and tag separately. For a precombined string, use `decryptStringFull()`.
 * @param {string} ciphertext The encrypted string
 * @param {string} iv The initialization vector (iv) used for the original encryption
 * @param {string} tag The authentication tag generated with the original encryption
 * @returns {string} The original plaintext
 */
function decryptString(ciphertext, iv, tag) {
    if (!env.secretKey)
        throw Error("'secretKey' not configured in environment.js");
    if (isEmpty(ciphertext)) throw Error("Cannot decrypt empty ciphertext.");
    if (isEmpty(iv))
        throw Error("Cannot decrypt with empty initialization vector (iv).");
    if (isEmpty(tag))
        throw Error("Cannot decrypt with empty authentication tag.");
    let keyBytes = Buffer.from(env.secretKey, "base64");
    let decipherer = crypto.createDecipheriv("aes-256-gcm", keyBytes, iv);
    decipherer.setAuthTag(Buffer.from(tag, "base64"));
    let plaintext = decipherer.update(ciphertext, "base64", "utf-8"); // Add string to be decrypted
    plaintext += decipherer.final("utf-8"); // Finalise the decryption
    return plaintext;
}

/**
 * Decrypts a string using AES-256(-GCM), using the secret key configured in `environment.js`.
 * Accepts a precombined string. For individual elements, use `decryptString()`.
 * @param {string} fullCiphertext The precombined cipher string in the format: '`<ciphertext>;<iv>;<tag>`'.
 * @returns {string} The original plaintext
 */
function decryptStringFull(fullCiphertext) {
    let cipherPieces = fullCiphertext.split(";");
    if (cipherPieces.length != 3) {
        throw Error(
            "Invalid fullCiphertext. Should be in the format: " +
                "'<ciphertext>;<iv>;<tag>'"
        );
    }
    let plaintext = decryptString(
        cipherPieces[0] /*ciphertext*/,
        cipherPieces[1] /*iv*/,
        cipherPieces[2] /*tag*/
    );
    return plaintext;
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
 * @see {@linkcode createUser}
 */
function listRequiredFields() {
    return JSON.stringify(requiredFields);
}

/**
 * Creates a new user on the database.
 * @param {object} userObject A dictionary containing the values to insert for the new user.
 * To see the minimum required fields and their types, run:
 * ```javascript
 * console.log(dbUserUtils.listRequiredFields())
 * ```
 * or see {@link requiredFields}.
 * @returns {number} The ID of the newly created user.
 * @throws Various `Error`s when fields are missing or invalid.
 */
function createUser(userObject) {
    if ("id" in userObject)
        throw Error(
            "ID should not be included in new user data; it is generated automatically."
        );

    for (const [field, value] of Object.entries(requiredFields)) {
        // If field does not exist
        if (isEmpty(userObject[field]))
            throw Error(`Field '${field}' is required but was not found.`);

        // If field does not match required type
        if (typeof userObject[field] != requiredFields[field][0]) {
            let errorStr =
                `Field '${field}' was not of required type '${requiredFields[field][0]}'` +
                ` (was instead '${typeof userObject[field]}').`;
            if (field == "sex")
                errorStr += ` For field '${field}', use the dbUserUtils.sex enum.`;
            if (field == "dob")
                errorStr += ` For field '${field}', use the Date class.`;
            throw Error(errorStr);
        }
    }

    if (!isValidDate(userObject["dob"]))
        throw Error(`Date for 'dob' is invalid.`);

    genID = generateID(
        userObject.firstName +
            userObject.lastName +
            userObject.dob.toString() +
            userObject.email
    );

    console.log("Inserting into DB...");
    prepClient();
    let insertPromise = dbconnect.globals.client
        .db(dbName)
        .collection(collectionName)
        .insertOne(userObject);
    insertPromise.finally(() => dbconnect.closeClient());
    console.log("Insertion complete.");
}

/**
 *
 * @param {string} identifier
 * @param {"id"|"email"} identifierForm
 * @returns
 */
async function getUserWhole(identifier, identifierForm = "id") {
    if (isEmpty(identifier)) throw Error("No ID provided to get user with.");
    let validIDForms = ["id", "email"];
    if (!(validIDForms.includes(identifierForm)))
        throw Error(
            `Invalid identifier form (should be one of: ${validIDForms})`
        );
    prepClient();
    let filter = {[identifierForm]: identifier};
    console.log(filter)
    let findPromise = dbconnect.globals.client
        .db(dbName)
        .collection(collectionName)
        .findOne(filter);
    findPromise.finally(() => dbconnect.closeClient());
    return await findPromise;
}

function updateUserWhole(userObject) {
    //TODO: Create updateUserWhole
}

function destroyUser(id) {
    //TODO: Create destroyUser
}

module.exports = {
    sex,
    hashString,
    encryptString,
    encryptStringFull,
    decryptString,
    decryptStringFull,
    listRequiredFields,
    createUser,
    getUserWhole,
    updateUserWhole,
    destroyUser,
};
