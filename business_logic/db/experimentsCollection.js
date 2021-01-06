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
  experimentsCollection_global.remove({});
  experimentsCollection_global.insert(experiment);
}
function getExperiment(expId) {
  let output = experimentsCollection_global.find({ exp_id: expId }, function (err, res) {
    if (err);
    return null;
  });
  return output;
}
//remove after hackhton
function getExperiments() {
  let output = experimentsCollection_global.find({}, function (err, res) {
    if (err);
    return null;
  });
  return output;
}

function getExperimentByCode(expCode) {
  let output = experimentsCollection_global.find({ exp_code: expCode }, function (err, res) {
    if (err);
    return null;
  });
  return output;
}


function insertParticipant(expId, participant) {
  let username = participant.participant_twitter_username;
  let groupId = participant.group_id;
  let experiment = collection.find({ exp_id: expId });
  let groups = experiment.exp_groups;
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].group_id == groupId) {
      groups[i].push(username);
    }
  }
  experimentsCollection_global.insertOne(experiment, function (err, res) {
    if (err);
    return false;
  });
  return true;
}


module.exports = {
  loadExperimentsCollection: loadExperimentsCollection,
  insertExperiment: insertExperiment,
  insertParticipant: insertParticipant,
  getExperiment: getExperiment,
  getExperiments: getExperiments,
  getExperimentByCode: getExperimentByCode
}