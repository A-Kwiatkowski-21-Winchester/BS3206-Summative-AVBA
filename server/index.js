require('dotenv').config();
const cors = require('cors');

const express = require('express');

PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());

let env;
try {
    env = require('./env/environment');
} catch {
    console.error("Unable to load './env/environment.js'. Have you filled out the template and renamed it?");
}

/// START OF MONGODB TEST BIT

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${env.username}:${env.password}@${env.clusterName}/?retryWrites=true&w=majority&appName=AVBA-Cluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


let db = client.db("sample_guides");
//console.log(db);

let collection = db.collection("planets");
//console.log(collection);

let record = collection.findOne()
record.then(result => { console.log(result) })


/// END OF MONGODB TEST BIT

app.get('/', (req, res) => {
    res.send('Hello universe!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});