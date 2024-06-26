const express = require('express');
const dbconnect = require('../libs/dbconnect');
const router = express.Router();
const { ObjectId } = require('mongodb');




//Create an article 
router.post('/create', (req, res) => {
    let client = dbconnect.generateClient();
    dbconnect.openClient(client);
   
    let db = client.db("MentalHealth")
    let collection = db.collection("Articles")

    collection.insertOne(req.body)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).json(err))
    .finally(() => dbconnect.closeClient(client))
})

//Get All Articles
router.get("/", async (_, res) => {

    let client = dbconnect.generateClient();
    dbconnect.openClient(client);

    let db = client.db("MentalHealth")
    let collection = db.collection("Articles")

    collection.find({}).toArray()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).json(err))
    .finally(() => dbconnect.closeClient(client))
 
});


module.exports = router