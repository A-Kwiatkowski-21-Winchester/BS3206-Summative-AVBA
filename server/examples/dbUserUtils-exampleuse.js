// VERY ROUGH DRAFT
// ****************

let dbUserUtils = require("../libs/dbUserUtils")
let bcrypt = require("bcrypt")


//TODO: remove test below
/* dbUserUtils.createUser({
    title: "Mx.",
    firstName: "Peter",
    lastName: "Dinkley",
    dob: new Date("2024-05-06"),
    sex: dbUserUtils.sex.MALE,
    email: "bark@dog.com",
    phone: "07000000000",
    password:
        "1081222ec66cd7649f3f310bc0170f9195b9a79b693de38acaf68adbe23dcf59",
    isAdmin: false,
});
 */

dbUserUtils.getUserWhole("bark@dog.com", "email").then((result) => console.log(result))








//TODO: Remove these
//#region TESTS
const teststring = "meow";
let hashstrr = dbUserUtils.hashString(teststring);
// let encryptionResult = encryptString(hashstrr);
let encryptionResult = dbUserUtils.encryptStringFull(hashstrr);
/*
console.log(encryptionResult.ciphertext);
console.log(encryptionResult.iv);
console.log(encryptionResult.tag);

let decryptionResult = decryptString(
    encryptionResult.ciphertext,
    encryptionResult.iv,
    encryptionResult.tag
);*/
console.log(encryptionResult);
let decryptionResult = dbUserUtils.decryptStringFull(encryptionResult);
console.log(decryptionResult);
console.log(`Match? : ${bcrypt.compareSync(teststring, decryptionResult)}`);

//#endregion
