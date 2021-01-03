const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://dekellevy:dekeldekel@twixper0.jo1eq.mongodb.net/Twixper()?retryWrites=true&w=majority";


const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});


  //delete the last experiment and insert the new one
  function insertExperiment (experiment){
    collection.remove({});
    collection.insert(experiment);
  }