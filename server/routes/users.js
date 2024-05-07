const express = require('express');
const dbUserUtils = require('../libs/dbUserUtils');
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

// Last resort
router.get("/", async (req, res) => {

    //Create base code
    console.log("User API")
    res.json({message:"Page!"})
 
});



module.exports = router
