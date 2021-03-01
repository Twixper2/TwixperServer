var makeDb = require("./DBConnector.js").makeDb

// TODO DEKEL: Make a fucntion that receieves expId and array of tweets,
// and inserts to tweetsCollection objects like this:
/* (example of a document)
    {
        expId: 1232135145,
        tweet: {
            // The tweet itself
        }
    }
*/
// this function is non blocking' we don't need to wait for response.