const express = require("express");
const dbUserUtils = require("../libs/dbUserUtils");
const router = express.Router();

// SAMPLE CODE FROM ABDULLAH'S APPOINTMENTS.JS
// get all appointments
/* router.get("/", async (_, res) => {

    dbconnect.generateClient();
    dbconnect.openClient();

    let client = dbconnect.globals.client;
    let db = client.db("GPData")
    let collection = db.collection("GPAppointments")

    collection.find({}).toArray()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).json(err))
    .finally(() => dbconnect.closeClient())
 
}); */

function leftover() {
    //TODO: Create function that handles /* with a list of available subpaths
}

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

router.delete("/destroy", async (req, res) => {
    console.log("Reached /destroy");
    //TODO: Add destroy function
});

router.get("/password/check", async (req, res) => {
    console.log("Reached /password/check");
    //TODO: Add password check function
});

router.put("/password/change", async (req, res) => {

    console.log("Reached /password/change")
    //TODO: Add password change function

});

router.all("/password/*", function (req, res) {
    console.log("Reached /password");
    console.log(req.accepts())
    //res.redirect(404, "/")
    res.status(404).json({available_subpaths: ["/check", "/change"]});
    //TODO: Add password default path
});

router.get("/session/get", async (req, res) => {

    console.log("Reached /session/get")
    //TODO: Add session get function    

});

router.get("/session/check", async (req, res) => {

    console.log("Reached /session/check")
    //TODO: Add session check function

});

router.delete("/session/expire", async (req, res) => {

    console.log("Reached /session/expire")
    //TODO: Add session expire function

});


router.all("/session/*", function (req, res) {

    console.log("Reached /session/*")
    //TODO: Add session default path

});


// Default route
router.get("/", async (req, res) => {
    //Create base code
    console.log("User API");
    res.json({ message: "Page!" });
});

module.exports = router;
