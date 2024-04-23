const express = require('express');
const dbconnect = require('../dbconnect');
const { ObjectId } = require('mongodb');
const router = express.Router();


router.post('/create', (req, res) => {
    console.log(req.body)
    dbconnect.generateClient();
    dbconnect.openClient();
   
    let client = dbconnect.globals.client;
    let db = client.db("MentalHealth")
    let collection = db.collection("Articles")

    collection.insertOne(req.body)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).json(err))
    .finally(() => dbconnect.closeClient())
})

module.exports = router