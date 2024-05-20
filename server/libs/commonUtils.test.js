const commonUtils = require("../libs/commonUtils")

test("isEmpty with undefined", () => {
    expect(commonUtils.isEmpty(undefined)).toBe(true)
});

test("isEmpty with empty string", () => {
    expect(commonUtils.isEmpty("")).toBe(true)
});

test("isEmpty with filled string", () => {
    expect(commonUtils.isEmpty("freak")).toBe(false)
});
