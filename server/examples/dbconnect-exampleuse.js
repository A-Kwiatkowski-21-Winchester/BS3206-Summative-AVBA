/* eslint-disable no-unused-vars */
/**
 * A function with comments to explain each step. See {@link explainRun here} for more.
 */
function explainRun() {
    // Helper module import.
    let dbconnect = require('../libs/dbconnect');

    // Generate a client
    let client = dbconnect.generateClient();

    // Open the client
    dbconnect.openClient(client);

    // Ping the global client as a test
    dbconnect.ping(client);

    // Get a specific database from a client
    let db = client.db("sample_guides")

    // Get a specific collection from a database
    let collection = db.collection("planets")

    // Get a record from a collection. There are many ways to get records, this is one of them.
    //  the `.findOne` method is asynchronous, so will not return your result immediately
    //  - instead, it returns a Promise.
    let recordPromise = collection.findOne(/*(no filter)*/)

    // Set a "then" action for the Promise using an arrow function
    // (see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#syntax )
    recordPromise.then(
        (result) => console.log(result)
    )

    // Can also be done with an anonymous function if it's more readable for you:
    // (see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function#syntax )
    /*

    recordPromise.then(
        function(result) {
            console.log(result)
        }
    )

    */


    // Closes the client. 
    dbconnect.closeClient(client);
    // ^ If this is called too early, your asynchronous function from earlier (.findOne) will yell at you,
    // because it might still be using the client. 
    // If you're only performing one action, this is easily solved by putting the close client command 
    // inside findOne's "finally" action, to ensure it is the last thing it does.
}

/**
 * A function with no comments to show how to write the code for this.
 */
function exampleRun() {
    let dbconnect = require('../libs/dbconnect');

    let client = dbconnect.generateClient();

    dbconnect.openClient(client);

    dbconnect.ping(client);

    let db = client.db("sample_guides")
    let collection = db.collection("planets")
    let recordPromise = collection.findOne()
    
    recordPromise.then(
        (result) => console.log(result)
    )
    recordPromise.catch(
        () => console.error("Couldn't find record.")
    )
    recordPromise.finally(
        () => dbconnect.closeClient(client)
    )
}


module.exports = {
    exampleRun,
}