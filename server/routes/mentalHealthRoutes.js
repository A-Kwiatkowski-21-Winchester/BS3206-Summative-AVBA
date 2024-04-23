const express = require('express');
const dbconnect = require('../dbconnect');
const { ObjectId } = require('mongodb');
const router = express.Router();



//Create an article 
router.post('/create', (req, res) => {
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

//Get All Articles
router.get("/", async (_, res) => {

    dbconnect.generateClient();
    dbconnect.openClient();

    let client = dbconnect.globals.client;
    let db = client.db("MentalHealth")
    let collection = db.collection("Articles")

    collection.find({}).toArray()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).json(err))
    .finally(() => dbconnect.closeClient())
 
});


module.exports = router