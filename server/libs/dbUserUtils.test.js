const dbUserUtils = require("./dbUserUtils");
const { describe, expect, test, afterAll } = require("@jest/globals");

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
        if (!(await validTestUserID))
            throw new TestingError(
                "This test cannot be run alone - " +
                    "it must be run as part of the entire test file"
            );

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
        if (!(await validTestUserID))
            throw new TestingError(
                "This test cannot be run alone - " +
                    "it must be run as part of the entire test file"
            );

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
        if (!(await validTestUserID))
            throw new TestingError(
                "This test cannot be run alone - " +
                    "it must be run as part of the entire test file"
            );
            
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
        await expect(dbUserUtils.getUserData("!!!", "milk")).resolves.toBeFalsy();
    });

});
//#endregion


// *** Example of conditional expect - best avoided
// eslint-disable-next-line jest/no-commented-out-tests
/* test("Deliberate failure", async () => {
    expect.assertions(1);
    try {
        await dbUserUtils.getUserData("654613", "field", "smork");
    } catch (error) {
        expect(error.message).toContain("identifier");
    }
}); */

//#region Erasing test users
//ERASE TEST USERS AFTER TESTING

afterAll(async () => {
    const dbconnect = require("./dbconnect");

    dbconnect.generateClient();
    dbconnect.openClient();

    // Delete testing users
    let updatePromise = dbconnect.globals.client
        .db("Users")
        .collection("UserData")
        .deleteMany({
            userForTesting: true,
        });

    updatePromise.catch(() => console.error("Error deleting test users"));
    updatePromise.finally(() => dbconnect.closeClient());
    await updatePromise;
    console.log("Test users deleted.");
});

//#endregion
