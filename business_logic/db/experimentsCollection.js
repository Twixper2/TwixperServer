var makeDb = require("./DBConnector.js").makeDb


//delete the last experiment and insert the new one
async function insertExperiment(experiment) {
  const db = await makeDb()
  let result = null
  try{
    let collection = db.collection("Experiments")
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
    let collection = db.collection("Experiments")
    result = await collection.find({ exp_id: expId })
    result = await result.toArray()
    result = result[0]
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
    let collection = db.collection("Experiments")
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
    let collection = db.collection("Experiments")
    result = await collection.find({ exp_code: expCode })
    result = await result.toArray() //, { exp_id: 1, _id: 0 }
    result = result[0]
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

  let groups = exp.exp_groups;
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]
    if (group.group_id == groupId) {
      group.group_participants.push(username);
    }
  }

  const db = await makeDb()
  let result = null
  // TODO: Update instead of insert and delete
  try{
    let collection = db.collection("Experiments")
    await collection.deleteOne({ exp_id: expId })
    result = await collection.insertOne(exp)
  }
  catch(e){
    console.log(e)
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
    let collection = db.collection("Experiments")
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