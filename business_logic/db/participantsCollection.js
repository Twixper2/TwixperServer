const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://dekellevy:dekeldekel@twixper0.jo1eq.mongodb.net/Twixper()?retryWrites=true&w=majority";


const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});

var collection;

function insertParticipant (participant){
    collection.insert(participant);
}


function getParticipantData(id){
    return collection.find({ "_id": id });
}