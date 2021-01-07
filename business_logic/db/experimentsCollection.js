import { makeDb } from "./DBConnector.js"


//delete the last experiment and insert the new one
async function insertExperiment(experiment) {
  const db = await makeDb()
  let experimentsCollection = await db.collection("Experiments")
  await experimentsCollection.remove({});
  await experimentsCollection.insert(experiment);
}

async function getExperimentById(expId) {
  let output = await experimentsCollection_global.find({ exp_id: expId }, function (err, res) {
    if (err);
    return null;
  });
  return output;
}


//remove after hackhton
async function getExperiments() {
  let output = await experimentsCollection_global.find({}, function (err, res) {
    if (err);
    return null;
  });
  return output;
}

async function getExperimentByCode(expCode) {
  let output = await experimentsCollection_global.find({ exp_code: expCode }, function (err, res) {
    if (err);
    return null;
  });
  return output;
}


async function insertParticipant(expId, participant) {
  let username = participant.participant_twitter_username;
  let groupId = participant.group_id;
  let experiment = await experimentsCollection_global.find({ exp_id: expId });
  let groups = experiment.exp_groups;
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].group_id == groupId) {
      groups[i].group_participants.push(username);
    }
  }
  await experimentsCollection_global.insertOne(experiment, function (err, res) {
    if (err);
    return false;
  });
  return true;
}


module.exports = {
  loadExperimentsCollection: loadExperimentsCollection,
  insertExperiment: insertExperiment,
  insertParticipant: insertParticipant,
  getExperimentById: getExperimentById,
  getExperiments: getExperiments,
  getExperimentByCode: getExperimentByCode
}