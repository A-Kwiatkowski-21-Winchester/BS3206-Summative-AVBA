const bcrypt = require("bcrypt");
const crypto = require("crypto");

const { isEmpty } = require("./commonUtils");

let env;
try {
    env = require("../env/environment");
} catch {
    throw Error(
        "Unable to load './env/environment.js'. Have you filled out a copy of the template and renamed it?"
    );
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
 * Represents a CipherObject, which contains the elements created after encryption.
 * @typedef {object} CipherObject
 * @property {string} ciphertext An encrypted string
 * @property {string} iv The initialization vector (iv) used for the encryption
 * @property {string} tag The authorization tag used for verification when decrypting
 */

/**
 * Encrypts a string using AES-256(-GCM), using the secret key configured in `environment.js`.
 * @param {string} plaintext The string to be encrypted.
 * @returns {CipherObject} An object containing: `ciphertext`, `iv`, and `tag`.
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
    ciphertext += cipherer.final("base64"); // Finalize the encryption
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
    plaintext += decipherer.final("utf-8"); // Finalize the decryption
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

module.exports = {
    hashString,
    encryptString,
    encryptStringFull,
    decryptString,
    decryptStringFull,
};
