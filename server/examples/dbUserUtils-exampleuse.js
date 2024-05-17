// EXAMPLE USES FOR DBUSERUTILS
// ****************************

let dbUserUtils = require("../libs/dbUserUtils");

// # USER OBJECTS
// Creation of user with minimum required fields.
dbUserUtils.createUser({
    title: "Mx.",
    firstName: "Peter",
    lastName: "Dinkley",
    dob: new Date("2024-05-06"),
    sex: dbUserUtils.sex.MALE,
    email: "bark@dog.com",
    phone: "07000000000",
    // Password value should already be SHA-256 hashed client-side before being passed here.
    password:
        "1081222ec66cd7649f3f310bc0170f9195b9a79b693de38acaf68adbe23dcf59",
    isAdmin: false,

    // Additional data CAN be added at this stage also:
    preferredAnimal: "dog",
});

// Get the whole user object and do something with it
dbUserUtils.getUserWhole("bark@dog.com", "email").then((result) => {
    console.log(result);
});

// Destroys a user from the database
dbUserUtils.destroyUser("184533557");

// # USER DATA MANIPULATION
// Add a new data field to a user
dbUserUtils.addUserData("128350317", "favCoffee", "latte");

// Replace the value of a data field on a user
dbUserUtils.addUserData("128350317", "favCoffee", "cappucino");

// Add an additional value to a data field on a user (creates an array)
//                                                   "intoArray" ↓     ↓ "replace"
dbUserUtils.addUserData("128350317", "favCoffee", "cappucino", true, false);

// Gets data from a field on a user. Returns an object with the required fields and values.
dbUserUtils.getUserData("128350317", "favCoffee").then((result) => {
    console.log("Fav coffee: ", result.favCoffee);
});

// Gets data from multiple fields on a user
dbUserUtils
    .getUserData("128350317", ["favCoffee", "preferredAnimal"])
    .then((result) => {
        console.log(
            `${result.preferredAnimal} can't drink ${result.favCoffee}!`
        );
    });

// Removes a data field on a user. Will not work for required fields.
dbUserUtils.removeUserData("128350317", "favCoffee");

// # PASSWORDS
// Change a user's password. The password you pass in here should already be SHA-256 hashed client-side.
dbUserUtils.changePassword("128350317", "boof");

// Check a user's password against a value. This value should already be SHA-256 hashed client-side.
dbUserUtils.checkPassword("128350317", "boof").then((result) => {
    console.log("Pass match: ", result);
});

// # SESSION TOKENS
// Create a session token.
dbUserUtils.createSessionToken("borkus@fr.fr", "blorf").then((result) => {
    console.log("Token: ", result);
});

// Check a session token's validity.
let token = "testToken";
dbUserUtils.checkSessionToken(token).then((validity) => {
    console.log("Valid?:", validity);
});
