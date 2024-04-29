let dbconnect = require('../libs/dbconnect');

/** 
 * Generates and opens a dbconnect client. 
 */
function prepClient() {
    dbconnect.generateClient()
    dbconnect.openClient();
}

/**
 * Generates an ID number by hashing a provided string, then converting the hash result to decimal
 * @param {string} comboString 
 */
function generateID(comboString, truncation = 9) {

}


module.exports = {

};