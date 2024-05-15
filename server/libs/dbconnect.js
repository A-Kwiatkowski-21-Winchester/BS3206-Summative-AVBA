let env;
try {
    env = require("../env/environment");
} catch {
    throw Error(
        "Unable to load './env/environment.js'. Have you filled out a copy of the template and renamed it?"
    );
}

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${env.username}:${env.password}@${env.clusterName}/?retryWrites=true&w=majority&appName=AVBA-Cluster`;

/**
 * Holds the global dbconnect variables.
 */
let globals = {
    /** The global client.
     * @type {MongoClient} */
    client: null,

    /** Whether the dbconnect functions write their actions to console.
     * @type {boolean} */
    verbose: false,
};

/**
 * Generates a new client to communicate with the database.
 * @param {boolean} global If the generated client should be global. Defaults to `true`.
 * - If `true`, sets the global `.client` property in this module.
 * - If `false`, returns the newly generated client.
 * @param {string} customUri A custom URI to connect to. If empty, uses the default configured URI.
 */
function generateClient(global = true, customUri = null) {
    let uriToUse = customUri ? customUri : uri;
    let newClient = new MongoClient(uriToUse, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });
    if (global) {
        globals.client = newClient;
    } else {
        return newClient;
    }
    if (globals.verbose) console.log("New client generated");
}

/**
 * Opens the designated client connection so actions can be performed.
 * @param {MongoClient} clientToOpen The client to open. If left empty,
 * will open the global `.client` property in this module.
 */
function openClient(clientToOpen = null) {
    try {
        if (clientToOpen) {
            clientToOpen.connect();
        } else {
            globals.client.connect();
        }
        if (globals.verbose) console.log("Opening client connection...");
    } catch {
        console.error("Failed to open connection to client.");
    }
}

/**
 * Closes the designated client. Once a client is closed, it cannot be used
 * again and a new one must be generated using {@linkcode generateClient()}.
 * @param {MongoClient} clientToClose The client to close. If left empty,
 * will close the global `.client` property in this module.
 */
function closeClient(clientToClose = null) {
    try {
        if (clientToClose) {
            clientToClose.close();
        } else {
            globals.client.close();
        }
        if (globals.verbose) console.log("Closing client connection...");
    } catch {
        console.error("Failed to close connection to client.");
    }
}

/**
 * **[NOT YET FUNCTIONAL]**
 * Has unpredictable results. Do not use.
 *
 * Performs one database action.
 * Will automatically generate, open, and close the needed client.
 * @param {function} action Action to perform inside database transaction
 * @example
 * transaction(() => client.db("sample_guides").collection("planets").findOne())
 */
async function transaction(action) {
    let success = false;
    let result;
    let tempClient = generateClient(false);
    async function run() {
        try {
            // Connect the client to the server
            await tempClient.connect();
            result = await action();
            console.log(result);
            success = true;
        } finally {
            // Ensures that the client will close when you finish/error
            await tempClient.close();
        }
        if (!success) throw Error("Unsuccessful transaction.");
    }

    run().catch(console.dir);
    return result;
}

/**
 * Pings the designated client and puts a log message in console.
 * The client should be {@link openClient opened} before attempting ping.
 * @param {MongoClient} clientToUse The client to use. If left empty,
 * will use the global `.client` property in this module.
 */
async function ping(clientToUse = null) {
    if (!clientToUse) {
        clientToUse = globals.client; // Use global client if none specified
    }
    console.log("Ping start");
    try {
        await clientToUse.db("admin").command({ ping: 1 });
        console.log(
            `Ping complete - successfully connected to ${clientToUse.options.srvHost}`
        );
    } catch {
        console.error(`Ping to ${clientToUse.options.srvHost} failed.`);
    }
}

module.exports = {
    globals,
    generateClient,
    openClient,
    closeClient,
    ping,
    transaction,
};
