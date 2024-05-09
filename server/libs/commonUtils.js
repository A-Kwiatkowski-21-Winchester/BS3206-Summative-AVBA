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
 * Tests if a string is undefined or empty.
 * @param {string} string String to test.
 * @returns {boolean} Whether the string is empty or not.
 */
function isEmpty(string) {
    return string == undefined || string === "";
}

/**
 * Compares strings to determine if they are semantically (case insensitively) equal.
 * @param {string} string1 The first string to compare.
 * @param {string} string2 The second string to compare.
 * @param {boolean} trim *(optional)* Whether to trim whitespace from the strings before comparison (default `true`).
 * @returns
 */
function isSemEqual(string1, string2, trim = true) {
    if (string1 === string2) return true;
    if ([string1, string2].some(val => val === undefined)) return false;
    if (trim) [string1, string2] = [string1.trim(), string2.trim()];
    let semEqual = string1.localeCompare(string2, undefined, { sensitivity: "accent" }) ===
        0;
    return semEqual;
}


module.exports = {
    isValidDate,
    isEmpty,
    isSemEqual
};