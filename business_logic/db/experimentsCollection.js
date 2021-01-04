// const { MongoClient } = require("mongodb");

// const uri = "mongodb+srv://dekellevy:dekeldekel@twixper0.jo1eq.mongodb.net/Twixper()?retryWrites=true&w=majority";


// const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});


// async function run() {
//     try {
//       await client.connect();
  
//       const database = client.db('Twixper');
//       const collection = database.collection('Participants');
//       const query = { _id: 2, name: 'nir dz' }; 
//       const user = await collection.insertOne(query);
  
//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }


var experimentsCollection_global = null

async function loadExperimentsCollection(database) {
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


  //delete the last experiment and insert the new one
  function insertExperiment (experiment){

  }