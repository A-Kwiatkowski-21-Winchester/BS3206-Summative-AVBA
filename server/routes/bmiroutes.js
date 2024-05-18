const express = require('express');
const dbconnect = require('../libs/dbconnect');
const router = express.Router();

router.post('/create', (req, res) => {
    dbconnect.generateClient();
    dbconnect.openClient();
   
    let client = dbconnect.globals.client;
    let db = client.db("BMI")
    let collection = db.collection("Bmi Calculator")

    collection.insertOne(req.body)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).json(err))
    .finally(() => dbconnect.closeClient())
})

// add tracker api stuff here

// add delete function here

// update function here 

module.exports = router