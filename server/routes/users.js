const express = require("express");
const dbUserUtils = require("../libs/dbUserUtils");
const router = express.Router();

/**
 * Creates automatic functions that help handle "category" URLs, like
 * in this file's case, `/password`, which has subpaths.
 * @param {string} relativePath The path relative to the current router
 * @param {string[]} subpaths A list of subpaths to report back to the requester
 */
function leftover(relativePath, subpaths) {
    router.all(relativePath, function (req, res) {
        console.log(`Reached ${relativePath}`);
        //res.redirect(404, "/")
        res.status(404).json({
            error: "Invalid URL",
            title: `Category home for ${req.baseUrl + relativePath}`,
            available_subpaths: subpaths,
        });
    });

    router.all(`${relativePath}/*`, function (req, res) {
        console.log(`Reached ${relativePath}/*`);
        res.redirect(303, req.baseUrl + relativePath);
    });
}

/** Simple function that returns a `405` response for an unallowed method.  
 * Example:
 * ```js
 * router.all("/path", methodNotAllowed)
 * ```
 */
function methodNotAllowed(req, res) {
    res.status(405).send(`Method ${req.method} not allowed`);
}

let categoryURLs = {};

router.post("/create", function (req, res) {
    console.log("Reached /create");
    //TODO: Add create function
});

router.get("/get-whole", async (req, res) => {
    console.log("Reached /get-whole");
    //TODO: Add getWhole function
});

router.put("/update-whole", async (req, res) => {
    console.log("Reached /update-whole");
    //TODO: Add update-whole function
});

router.put("/add-data", async (req, res) => {
    console.log("Reached /add-data");
    //TODO: Add add-data function
});

router.get("/get-data", async (req, res) => {
    console.log("Reached /get-data");
    //TODO: Add get-data function
});

router.delete("/remove-data", async (req, res) => {
    console.log("Reached /remove-data");
    //TODO: Add remove-data function
});

router.delete("/destroy", async (req, res) => { //TODO: Figure out how to make compatible with /:id as well as ?id=
    console.log(`Reached ${req.baseUrl}/destroy`);

    //TODO: Add destroy function
});

router.get("/password/check", async (req, res) => {
    console.log("Reached /password/check");
    //TODO: Add password check function
});

router.put("/password/change", async (req, res) => {
    console.log("Reached /password/change");
    //TODO: Add password change function
});

categoryURLs["/password"] = ["/check", "/change"];

router.get("/session/get", async (req, res) => {
    console.log("Reached /session/get");
    //TODO: Add session get function
});

router.get("/session/check", async (req, res) => {
    console.log("Reached /session/check");
    //TODO: Add session check function
});

router.delete("/session/expire", async (req, res) => {
    console.log("Reached /session/expire");
    //TODO: Add session expire function
});

categoryURLs["/session"] = ["/get", "/check", "/expire"];

// Default route
router.get("/", async (req, res) => {
    //Create base code
    console.log("User API");
    res.json({ message: "Page!" });
});

// For all routes configured here, if any other method, return a 405 reponse
router.stack.forEach((item) => {
    router.all(item.route.path, methodNotAllowed);
});

// Configure categoryURLs with appropriate JSON response.
Object.keys(categoryURLs).forEach((category) => {
    leftover(category, categoryURLs[category])
})

module.exports = router;
