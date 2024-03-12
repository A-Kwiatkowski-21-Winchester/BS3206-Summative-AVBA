let env;
try {
    env = require('./env/environment');
} catch {
    console.error("Unable to load './env/environment.js'. Have you filled out a copy of the template and renamed it?");
}

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${env.username}:${env.password}@${env.clusterName}/?retryWrites=true&w=majority&appName=AVBA-Cluster`;


let client;

/**
 * Generates a new client to communicate with the database.
 * @param {boolean} global If the generated client should be global. Defaults to `true`.
 * - If `true`, sets the `.client` property in this module. 
 * - If `false`, returns the newly generated client.
 */
function generateClient(global = true) {
    let newClient = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    if(global) {
        client = newClient;
    } else {
        return newClient
    }
}

/**
 * **[NOT YET FUNCTIONAL]**
 * @param {function} action Action to perform inside database transaction
 * @example
 * // returns 3
 * globalNS.method(5, 15);
 */
function transaction(action) {
    let success = false;
    let result;
    async function run() {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            //await client.db("admin").command({ ping: 1 })
            result = await action();
            console.log("TESTTRANS")
            console.log(result)
            success = true;
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
        if (!success) { throw Error("Unsuccessful transaction.") }
    }

    run().catch(console.dir);
    return result;
}

async function ping() {
    console.log("ping start attempt");
    //client.db("admin").command({ ping: 1 })
    //console.log(await client.db("sample_guides").collection("planets").findOne())
    let result = transaction(() => client.db("sample_guides").collection("planets").findOne())
    transaction(() => client.db("sample_guides").collection("planets").findOne())
    console.log("ping end attempt")
    console.log(result)
}


module.exports = {
    client,
    ping,
    transaction,
};