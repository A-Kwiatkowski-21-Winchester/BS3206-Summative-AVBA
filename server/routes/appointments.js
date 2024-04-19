const express = require('express');
const dbconnect = require('../dbconnect');
const router = express.Router();


// get all appointments
router.get("/", async (_, res) => {
    result = []
    dbconnect.generateClient();
    dbconnect.openClient();

    let client = dbconnect.globals.client;
    let db = client.db("GPData")
    let collection = db.collection("GPAppointments")

    collection.find({}).toArray()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).json(err))
    .finally(() => dbconnect.closeClient())
 
});

//Add a user appointment
router.post('/create', (req, res) => {
    
    dbconnect.generateClient();
    dbconnect.openClient();
   
    let client = dbconnect.globals.client;
    let db = client.db("GPData")
    let collection = db.collection("GPAppointments")

    let recordPromise = collection.insertOne(req.body);

    recordPromise.then(
        () => Alert("Successuflly updated DB")
    )
    recordPromise.catch(
        () => console.error("Error in updating DB.")
    )
    recordPromise.finally(
        () => dbconnect.closeClient()
    )
})

module.exports = router
