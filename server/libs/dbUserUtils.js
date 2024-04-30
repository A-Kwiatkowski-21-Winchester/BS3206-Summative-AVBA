let dbconnect = require("../libs/dbconnect");
let { md5 } = require("js-md5");
let bcrypt = require("bcrypt");
let crypto = require("crypto");

// Constants
const dbName = "Users";
const collectionName = "UserData";
const idPrefix = "AH-";

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

/**
 * Generates an ID number by hashing a provided string, then converting the hash result to decimal.
 *
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
        if (userObject[field] == undefined || userObject[field] === "")
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
    dbconnect.globals.client
        .db(dbName)
        .collection(collectionName)
        .insertOne(userObject);
    dbconnect.closeClient();
    console.log("Insertion complete.");
}

let testdate = new Date(1714510595 * 1000);
console.log(testdate);
console.log(typeof testdate);
console.log(testdate.toJSON());

//TODO: remove test below
createUser({
    title: "Mx.",
    firstName: "Peter",
    lastName: "Dinkley",
    dob: new Date("2024-05-06"),
    sex: sex.MALE,
    email: "bark@dog.com",
    phone: "07000000000",
    password:
        "1081222ec66cd7649f3f310bc0170f9195b9a79b693de38acaf68adbe23dcf59",
    isAdmin: false,
});

function getUserDetails(id, fieldList) {}

function updateUserDetails(id, fieldValueObject) {}

function destroyUser(id) {}


module.exports = {
    sex,
    listRequiredFields,
    createUser,
    getUserDetails,
    updateUserDetails,
    destroyUser,
};
