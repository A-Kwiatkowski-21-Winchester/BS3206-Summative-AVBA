const express = require('express');
const dbconnect = require('../dbconnect');
const router = express.Router();


// get all appointments
router.get("/", async (_, res) => {
    dbconnect.generateClient();
    dbconnect.openClient();
   
    let client = dbconnect.globals.client;
    let db = client.db("GPData")
    let collection = db.collection("GPAppointments")
    let recordPromise = collection.findOne()

    recordPromise.then(
        (result) => console.log(result)
    )
    recordPromise.catch(
        () => console.error("Couldn't find record.")
    )
    recordPromise.finally(
        () => dbconnect.closeClient()
    )
    
});

//Add a user appointment
router.post('/create', (req, res) => {
    
    dbconnect.generateClient();
    dbconnect.openClient();
    //dbconnect.ping();
    let client = dbconnect.globals.client;
    let db = client.db("GPData")
    let collection = db.collection("GPAppointments")

    let recordPromise = collection.insertOne(req.body);

    recordPromise.then(
        (res) => console.log("Successuflly updated DB")
    )
    recordPromise.catch(
        () => console.error("Error in updating DB.")
    )
    recordPromise.finally(
        () => dbconnect.closeClient()
    )
})

module.exports = router
