const dbUserUtils = require("./dbUserUtils");
const dbconnect = require("./dbconnect");
const {
    describe,
    expect,
    test,
    afterAll,
    beforeAll,
} = require("@jest/globals");

// Custom Error
class TestingError extends Error {
    /**
     * A custom error to be thrown in case of inherent test problems (tests needing to be run together etc.).
     * @param {string} message A message to return describing the issue (and/or the cause).
     */
    constructor(message) {
        super(message);
        this.name = "TestingError";
    }
}

function shallowClone(obj) {
    return { ...obj };
}

/**
 * Checks for a prerequisite value provided by another test.
 * If it isn't present, throw a custom TestingError.
 * @param {obj} value The value to check for the existence of
 */
function preReqValue(value) {
    if (!value)
        throw new TestingError(
            "This test cannot be run alone - " +
                "it must be run as part of the entire test file"
        );
}

const demoUser = {
    title: "Mr",
    firstName: "Mark",
    lastName: "Stetson",
    dob: new Date(),
    sex: dbUserUtils.sex.MALE,
    email: "stet@met.co",
    password: "ringo",
    phone: "07000000000",
    isAdmin: false,
    extraData: "fizz",
    userForTesting: true,
};

let validTestUserID;
let validToken;

let dbConnection = false;

//#region Cleanup - Erasing Test Users
beforeAll(async () => {
    const dbconnect = require("./dbconnect");

    let client = dbconnect.generateClient();
    dbconnect.openClient(client);

    let pingSuccess = await dbconnect.ping(client);
    if (!pingSuccess) {
        dbconnect.closeClient(client);
        console.error("Unable to connect to database.");
        throw new TestingError(
            "Unable to connect to database - " +
                "database tests unable to be carried out"
        );
    }
    console.log("Database connection successful");
    dbConnection = true;
    dbconnect.closeClient(client);
});
//#endregion

//#region createUser() tests
describe("createUser() tests", () => {
    test("createUser() without any fields", async () => {
        await expect(dbUserUtils.createUser()).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("createUser() without appropriate fields", async () => {
        let testUser = { title: "Mr" };
        await expect(dbUserUtils.createUser(testUser)).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("createUser() with incorrect field type", async () => {
        let testUser = shallowClone(demoUser);
        testUser.email = 5; //INCORRECT TYPE

        await expect(dbUserUtils.createUser(testUser)).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("createUser() with invalid date for DOB", async () => {
        let testUser = shallowClone(demoUser);
        testUser.dob = "cake"; //UNPARSEABLE (INVALID) DATE

        await expect(dbUserUtils.createUser(testUser)).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("createUser() with valid fields", async () => {
        let testUser = shallowClone(demoUser); //VALID

        await expect(
            (validTestUserID = dbUserUtils.createUser(testUser))
        ).resolves.not.toThrow();
    });
});

//#endregion

//#region getUserWhole() tests
describe("getUserWhole() tests", () => {
    test("getUserWhole() without identifier", async () => {
        await expect(dbUserUtils.getUserWhole()).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("getUserWhole() with invalid identifier form", async () => {
        await expect(
            dbUserUtils.getUserWhole(await validTestUserID, "bakery")
        ).rejects.toThrow(dbUserUtils.RequestError);
    });

    test("getUserWhole() with valid identifier", async () => {
        preReqValue(validTestUserID); // Checks for previously created user

        let task;
        await expect(
            (task = dbUserUtils.getUserWhole(await validTestUserID))
        ).resolves.not.toThrow(dbUserUtils.RequestError);

        let result = await task;
        expect(result).toBeTruthy();
        expect(result).toHaveProperty("_id", expect.any(String));
    });
});

//#endregion

//#region updateUserWhole() tests
describe("updateUserWhole() tests", () => {
    test("updateUserWhole() with no argument", async () => {
        await expect(dbUserUtils.updateUserWhole()).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("updateUserWhole() with user with no _id", async () => {
        let testUser = shallowClone(demoUser); //has no _id

        await expect(dbUserUtils.updateUserWhole(testUser)).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("updateUserWhole() with user with non-existent _id", async () => {
        let testUser = shallowClone(demoUser);
        testUser._id = "!!!"; //should not exist

        await expect(dbUserUtils.updateUserWhole(testUser)).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("updateUserWhole() with user with valid _id", async () => {
        preReqValue(validTestUserID); // Checks for previously created user

        let testUser = shallowClone(demoUser);
        testUser._id = await validTestUserID; //should exist

        await expect(
            dbUserUtils.updateUserWhole(testUser)
        ).resolves.not.toThrow(dbUserUtils.RequestError);
    });
});

//#endregion

//#region addUserData() tests
describe("addUserData() tests", () => {
    test("addUserData() with no arguments", async () => {
        await expect(dbUserUtils.addUserData()).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("addUserData() with only some arguments", async () => {
        await expect(
            dbUserUtils.addUserData("!!!", "extraData")
        ).rejects.toThrow("was not provided");
    });

    test("addUserData() with ID or password", async () => {
        await expect(
            dbUserUtils.addUserData("!!!", "_id", "test")
        ).rejects.toThrow("cannot be changed");

        await expect(
            dbUserUtils.addUserData("!!!", "password", "test")
        ).rejects.toThrow("cannot be changed");
    });

    test("addUserData() with intoArray and replace both false", async () => {
        await expect(
            dbUserUtils.addUserData("!!!", "extraData", "test", false, false)
        ).rejects.toThrow("cannot both be false");
    });

    test("addUserData() with invalid ID", async () => {
        await expect(
            dbUserUtils.addUserData("!!!", "extraData", "test")
        ).rejects.toThrow(dbUserUtils.RequestError);
    });

    test("addUserData() with valid ID", async () => {
        preReqValue(validTestUserID); // Checks for previously created user

        await expect(
            dbUserUtils.addUserData(await validTestUserID, "extraData", "test")
        ).resolves.not.toThrow(dbUserUtils.RequestError);
    });
});
//#endregion

//#region getUserData() tests
describe("getUserData() tests", () => {
    test("getUserData() with no arguments", async () => {
        await expect(dbUserUtils.getUserData()).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("getUserData() with invalid ID", async () => {
        await expect(
            dbUserUtils.getUserData("!!!", "someField")
        ).resolves.toBeFalsy();
    });

    test("getUserData() with invalid idenForm", async () => {
        await expect(
            dbUserUtils.getUserData("!!!", "someField", "bakery")
        ).rejects.toThrow(dbUserUtils.RequestError);
    });

    test("getUserData() with forbidden field (password)", async () => {
        await expect(
            dbUserUtils.getUserData("!!!", "password")
        ).rejects.toThrow(dbUserUtils.RequestError);
    });

    test("getUserData() with non-existent field", async () => {
        preReqValue(validTestUserID); // Checks for previously created user
        let result = await dbUserUtils.getUserData(
            await validTestUserID,
            "someField"
        );
        expect(Object.keys(result).length).toBe(0);
    });

    test("getUserData() with one existent field", async () => {
        preReqValue(validTestUserID); // Checks for previously created user
        let result = await dbUserUtils.getUserData(
            await validTestUserID,
            "extraData"
        );
        expect(Object.keys(result).length).toBe(1);
    });

    test("getUserData() with array of existent fields", async () => {
        preReqValue(validTestUserID); // Checks for previously created user

        let fieldArray = ["extraData", "firstName", "lastName"];
        let result = await dbUserUtils.getUserData(
            await validTestUserID,
            fieldArray
        );
        expect(Object.keys(result).length).toBe(fieldArray.length);
    });

    test("getUserData() with array of fields - one non-existent", async () => {
        preReqValue(validTestUserID); // Checks for previously created user

        let fieldArray = [
            "extraData",
            "firstName",
            "lastName",
            "gringle" /*invalid*/,
        ];
        let result = await dbUserUtils.getUserData(
            await validTestUserID,
            fieldArray
        );
        expect(Object.keys(result).length).toBe(fieldArray.length - 1);
    });
});

//#region removeUserData() tests
describe("removeUserData() tests", () => {
    test("removeUserData() with no arguments", async () => {
        await expect(dbUserUtils.removeUserData()).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("removeUserData() with invalid ID", async () => {
        await expect(
            dbUserUtils.removeUserData("!!!", "someField")
        ).rejects.toThrow(dbUserUtils.RequestError);
    });

    test("removeUserData() with non-existent field", async () => {
        preReqValue(validTestUserID); // Checks for previously created user

        await expect(
            dbUserUtils.removeUserData(await validTestUserID, "someField")
        ).rejects.toThrow(dbUserUtils.RequestError);
    });

    test("removeUserData() with existent field", async () => {
        preReqValue(validTestUserID); // Checks for previously created user

        await expect(
            dbUserUtils.removeUserData(await validTestUserID, "extraData")
        ).resolves.not.toThrow();
    });
});
//#endregion

//#region checkPassword() tests
describe("checkPassword() tests", () => {
    test("checkPassword() with no arguments", async () => {
        await expect(dbUserUtils.checkPassword()).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("checkPassword() with no password", async () => {
        await expect(dbUserUtils.checkPassword("!!!")).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("checkPassword() with correct password", async () => {
        preReqValue(validTestUserID); // Checks for previously created user

        await expect(
            dbUserUtils.checkPassword(await validTestUserID, demoUser.password)
        ).resolves.not.toThrow();
    });

    test("checkPassword() with garbled DB password", async () => {
        preReqValue(validTestUserID); // Checks for previously created user

        // * Manually manipulating password so it is garbled and undecryptable *
        let client = dbconnect.generateClient();
        dbconnect.openClient(client);
        let collection = client
            .db("Users")
            .collection("UserData");
        let updateTask = collection.findOneAndUpdate(
            { _id: await validTestUserID },
            { $set: { password: "bogus" } }
        );
        updateTask.finally(() => dbconnect.closeClient(client));
        await updateTask;
        // ***

        await expect(
            dbUserUtils.checkPassword(await validTestUserID, demoUser.password)
        ).rejects.toThrow(/problem with .*? password/);
    });
});
//#endregion

//#region changePassword() tests
describe("changePassword() tests", () => {
    test("changePassword() with no arguments", async () => {
        await expect(dbUserUtils.changePassword()).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("changePassword() with no newPassword", async () => {
        await expect(dbUserUtils.changePassword("!!!")).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("changePassword() with non-existent ID", async () => {
        await expect(dbUserUtils.changePassword("!!!", "bonk")).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("changePassword() with existent ID", async () => {
        preReqValue(validTestUserID); // Checks for previously created user

        // Change password
        await expect(
            dbUserUtils.changePassword(await validTestUserID, "bonk")
        ).resolves.not.toThrow();

        // Check password after change to confirm
        await expect(
            dbUserUtils.checkPassword(await validTestUserID, "bonk")
        ).resolves.not.toThrow();
    });
});
//#endregion

//#region createSessionToken() tests
describe("createSessionToken() tests", () => {
    test("createSessionToken() with no arguments", async () => {
        await expect(dbUserUtils.createSessionToken()).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("createSessionToken() with no password", async () => {
        await expect(dbUserUtils.createSessionToken("!!!")).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("createSessionToken() with invalid iden (email)", async () => {
        await expect(
            dbUserUtils.createSessionToken("!!!", "bork")
        ).rejects.toThrow(dbUserUtils.RequestError);
    });

    test("createSessionToken() with invalid idenForm", async () => {
        await expect(
            dbUserUtils.createSessionToken("!!!", "bork", "bakery")
        ).rejects.toThrow(dbUserUtils.RequestError);
    });

    test("createSessionToken() with valid params", async () => {
        preReqValue(validTestUserID);

        await expect(
            (validToken = dbUserUtils.createSessionToken(
                await validTestUserID,
                "bonk",
                "_id"
            ))
        ).resolves.not.toThrow();
    });
});
//#endregion

//#region checkSessionToken() tests
describe("checkSessionToken() tests", () => {
    test("checkSessionToken() with no arguments", async () => {
        await expect(dbUserUtils.checkSessionToken()).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("checkSessionToken() with invalid token", async () => {
        await expect(dbUserUtils.checkSessionToken("!!!")).resolves.toBeFalsy();
    });

    test("checkSessionToken() with valid token", async () => {
        preReqValue(validTestUserID);
        preReqValue(validToken);

        let tokenObject = await validToken;

        await expect(
            dbUserUtils.checkSessionToken(tokenObject._id)
        ).resolves.toBe(await validTestUserID);
    });
});
//#endregion

//#region expireSessionToken() tests
describe("expireSessionToken() tests", () => {
    test("expireSessionToken() with no arguments", async () => {
        await expect(dbUserUtils.expireSessionToken()).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("expireSessionToken() with invalid token", async () => {
        await expect(dbUserUtils.expireSessionToken("!!!")).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("expireSessionToken() with valid token", async () => {
        preReqValue(validToken);

        let tokenObject = await validToken;

        // Expire the token
        await expect(
            dbUserUtils.expireSessionToken(tokenObject._id)
        ).resolves.not.toThrow();

        // Check its validity (should be false)
        await expect(
            dbUserUtils.checkSessionToken(tokenObject._id)
        ).resolves.toBeFalsy();
    });
});
//#endregion

//#region destroyUser() tests
describe("destroyUser() tests", () => {
    //TODO: Add destroy tests
    test("destroyUser() with no arguments", async () => {
        await expect(dbUserUtils.destroyUser()).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("destroyUser() with non-existent ID", async () => {
        await expect(dbUserUtils.destroyUser("!!!")).rejects.toThrow(
            dbUserUtils.RequestError
        );
    });

    test("destroyUser() with existent ID", async () => {
        preReqValue(validTestUserID);

        await expect(
            dbUserUtils.destroyUser(await validTestUserID)
        ).resolves.not.toThrow();
    });
});
//#endregion

// *** Example of conditional expect - best avoided
// eslint-disable-next-line jest/no-commented-out-tests
/*
test("Deliberate failure", async () => {
    expect.assertions(1);
    try {
        await dbUserUtils.getUserData("654613", "field", "smork");
    } catch (error) {
        expect(error.message).toContain("identifier");
    }
});
*/

//#region Cleanup - Erasing Test Users
afterAll(async () => {
    if (!dbConnection)
        return console.log("No DB connected, no cleanup necessary.");

    let client = dbconnect.generateClient();
    dbconnect.openClient(client);

    // Delete testing users
    let updatePromise = client
        .db("Users")
        .collection("UserData")
        .deleteMany({
            userForTesting: true,
        });

    updatePromise.catch(() => console.error("Error deleting test users"));
    updatePromise.finally(() => dbconnect.closeClient(client));
    await updatePromise;
    console.log("Test users deleted.");
});
//#endregion
