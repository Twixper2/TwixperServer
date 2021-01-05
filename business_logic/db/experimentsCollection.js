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
    if (!experimentsCollection_global) {
      experimentsCollection_global = await database.collection('Experiments');
    }
  }
  catch {
    return null;
  }
}


//delete the last experiment and insert the new one
function insertExperiment(experiment) {
  collection.remove({});
  collection.insert(experiment);
}
function getExperiment(expId) {
  return experimentsCollection.find({ exp_id: expId });
}
//remove after hackhton
function getExperiments() {
  return collection.find({});
}

function getExperimentByCode(expCode) {
  return collection.find({ exp_code: expCode });
}

//what i need to insert? username
//to specific exp or just for hackthon the only exp - specific
function insertParticipant(expId, participant) {
  var parsedData = JSON.parse(participant);
  var username;
  var groupId;
  for (item in parsedData) {
    if (item == "participant_twitter_username") {
      username = parsedData[item];
    }
    if (item == "group_id") {
      groupId = parsedData[item];
    }

  }
  var experiment = collection.find({ exp_id: expId });
  var groups = experiment.exp_groups;
  for (var i = 0; i < groups.length; i++) {
    if (groups[i].group_id == groupId) {
      groups[i].push(username);
    }
  }
  collection.insert(experiment);
}


module.exports = {
  loadExperimentsCollection: loadExperimentsCollection,
  insertExperiment: insertExperiment,
  insertParticipant: insertParticipant,
  getExperiment: getExperiment,
  getExperiments: getExperiments,
  getExperimentByCode: getExperimentByCode
}