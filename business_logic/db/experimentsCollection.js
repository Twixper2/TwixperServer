var makeDb = require("./DBConnector.js").makeDb


//delete the last experiment and insert the new one
async function insertExperiment(experiment) {
  const db = await makeDb()
  let result = null
  try{
    collection = db.collection("Experiments")
    result = await collection.insertOne(experiment);
  }
  catch(e){
    return false
  }
  if(result){
    return true
  }
}

async function getExperimentById(expId) {
  const db = await makeDb()
  let result = null
  try{
    collection = db.collection("Experiments")
    result = await collection.findOne({ exp_id: expId }).toArray()[0]
  }
  catch(e){
    return null
  }
  return result
}


//remove after hackhton
async function getExperiments() {
  const db = await makeDb()
  let result = null
  try{
    collection = db.collection("Experiments")
    result = await collection.find({}).toArray()
  }
  catch(e){
    return null
  }
  return result
}

async function getExperimentByCode(expCode) { 
  const db = await makeDb()
  let result = null
  try{
    collection = db.collection("Experiments")
    result = await collection.findOne({ exp_code: expCode }, { exp_id: 1, _id: 0 }).toArray()[0]
  }
  catch(e){
    return null
  }
  return result
}


async function insertParticipantToExp(expId, participant) {
  let username = participant.participant_twitter_username;
  let groupId = participant.group_id;
  
  const exp = await getExperimentById(expId)
  if (exp == null) { return false; }

  let groups = experiment.exp_groups;
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]
    if (group.group_id == groupId) {
      group.group_participants.push(username);
    }
  }

  const db = await makeDb()
  let result = null
  try{
    collection = db.collection("Experiments")
    await collection.deleteOne({ exp_code: expCode })
    result = await collection.insertOne(experiment)
  }
  catch(e){
    return false
  }
  if (result) {
    return true
  }
  return false
}

//remove after hackhton
async function deleteAllExperiments() {
  const db = await makeDb()
  let result = null
  try{
    collection = db.collection("Experiments")
    result = await collection.deleteMany({})
  }
  catch(e){
    return false
  }
  if (result) {
    return true 
  }
  return false
}


module.exports = {
  insertExperiment: insertExperiment,
  insertParticipantToExp: insertParticipantToExp,
  getExperimentById: getExperimentById,
  getExperiments: getExperiments,
  getExperimentByCode: getExperimentByCode,
  deleteAllExperiments: deleteAllExperiments
}