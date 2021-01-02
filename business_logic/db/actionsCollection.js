const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://dekellevy:dekeldekel@twixper0.jo1eq.mongodb.net/Twixper()?retryWrites=true&w=majority";


const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});


function insertActions (action){


}


function getExpActions(expId){

}