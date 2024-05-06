const express = require('express');
const dbconnect = require('../dbconnect');
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



module.exports = router
