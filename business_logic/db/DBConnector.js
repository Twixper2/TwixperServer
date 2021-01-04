const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://dekellevy:dekeldekel@twixper0.jo1eq.mongodb.net/Twixper()?retryWrites=true&w=majority";

var database_global = null



async function getDatabase() {
    if (!database_global) {
        try {
            const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});
            await client.connect();
            database_global = client.db('Twixper');
        }
        catch { 
            return null;
        }
        return database_global
    }
}

module.exports = {
    getDatabase: getDatabase,
}