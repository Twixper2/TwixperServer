// const { MongoClient } = require("mongodb");
// const uri = "mongodb+srv://dekellevy:dekeldekel@twixper0.jo1eq.mongodb.net/Twixper()?retryWrites=true&w=majority";
// const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});

var actionsCollection_global = null

async function loadActionsCollection(database) {
    try {
        if (!actionsCollection_global){
            actionsCollection_global = await database.collection('Actions');
        }
    }
    catch {
        return null;
    }
}


function insertActions (action){
    collection.insert(action);
}


function getExpActions(expId){
    return collection.find({ "_expId": expId });
}

module.exports = {
    loadActionsCollection : loadActionsCollection
}