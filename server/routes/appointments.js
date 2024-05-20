const express = require('express');
const dbconnect = require('../libs/dbconnect');
const { ObjectId } = require('mongodb');
const router = express.Router();


// get all appointments
router.get("/", async (_, res) => {

    let client = dbconnect.generateClient();
    dbconnect.openClient(client);

    let db = client.db("GPData")
    let collection = db.collection("GPAppointments")

    collection.find({}).toArray()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).json(err))
    .finally(() => dbconnect.closeClient(client))
 
});

//Add a user appointment
router.post('/create', (req, res) => {
    
    let client = dbconnect.generateClient();
    dbconnect.openClient(client);
   
    let db = client.db("GPData")
    let collection = db.collection("GPAppointments")

    let recordPromise = collection.insertOne(req.body);

    recordPromise.then(
        () => {console.log("Successuflly updated DB")
            res.status(200).send("Success!")
        }
    )
    recordPromise.catch(
        () => console.error("Error in updating DB.")
    )
    recordPromise.finally(
        () => dbconnect.closeClient(client)
    )
})


router.delete('/delete/:id', (req, res) => {
    
    let client = dbconnect.generateClient();
    dbconnect.openClient(client);

    let db = client.db("GPData")
    let collection = db.collection("GPAppointments")

    collection.deleteOne({ _id: new ObjectId(req.params.id) })
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).json(err))
    .finally(() => dbconnect.closeClient(client))
})

module.exports = router
