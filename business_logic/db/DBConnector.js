const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://dekellevy:dekeldekel@twixper0.jo1eq.mongodb.net/Twixper()?retryWrites=true&w=majority";

var database_global = null
var participantsCollection_global = null
var experimentsCollection_global = null
var researchersCollection_global = null
var actionsCollection_global = null
var tweetsCollection_global = null



async function getExperimentsCollection() {
    try {
        if (!experimentsCollection_global)
            let database = await this.getDatabase()
            experimentsCollection_global = await database.collection('Experiments');
        return experimentsCollection_global
    }
    catch {
        return null;
    }
}

async function getResearchersCollection() {
    try {
        if (!researchersCollection_global)
            let database = await this.getDatabase()
            researchersCollection_global = await database.collection('Researchers');
        return researchersCollection_global
    }
    catch {
        return null;
    }
}

async function getActionsCollection() {
    try {
        if (!actionsCollection_global)
            let database = await this.getDatabase()
            actionsCollection_global = await database.collection('Actions');
        return actionsCollection_global
    }
    catch {
        return null;
    }
}

async function getTweetsCollection() {
    try {
        if (!tweetsCollection_global)
            let database = await this.getDatabase()
            tweetsCollection_global = await database.collection('Tweets');
        return tweetsCollection_global
    }
    catch {
        return null;
    }
}


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
    getActionsCollection : getActionsCollection,
    getExperimentsCollection : getExperimentsCollection, 
    getParticipantsCollection : getParticipantsCollection,
    getResearchersCollection : getResearchersCollection,
    getTweetsCollection : getTweetsCollection,
    getDatabase: getDatabase,
}