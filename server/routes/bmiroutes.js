const express = require('express');
const dbconnect = require('../libs/dbconnect');
const router = express.Router();

router.post('/create', (req, res) => {
    let client = dbconnect.generateClient();
    dbconnect.openClient(client);
   
    let db = client.db("BMI")
    let collection = db.collection("Bmi Calculator")

    collection.insertOne(req.body)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).json(err))
    .finally(() => dbconnect.closeClient(client))
})

// add tracker api stuff here

// add delete function here

// update function here 

module.exports = router