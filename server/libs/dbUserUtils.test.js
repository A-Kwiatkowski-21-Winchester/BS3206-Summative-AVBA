const dbUserUtils = require("./dbUserUtils");

test("Creating user without appropriate fields", async () => {
    await expect(
        dbUserUtils.createUser({
            title: "Mr",
        })
    ).rejects.toThrow(dbUserUtils.RequestError);
});

test("Getting user data with incorrect idenForm", async () => {
    await expect(
        dbUserUtils.getUserData("654613", "field", "smirk")
    ).rejects.toThrow(dbUserUtils.RequestError);
});

// eslint-disable-next-line jest/no-commented-out-tests
/* test("Deliberate failure", async () => {
    expect.assertions(1);
    try {
        await dbUserUtils.getUserData("654613", "field", "smork");
    } catch (error) {
        expect(error.message).toContain("identifier");
    }
}); */
