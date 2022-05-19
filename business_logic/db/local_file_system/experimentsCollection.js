var makeDb = require("./DBConnector.js").makeDb


// Insert new experiment
async function insertExperiment(experiment) {
  if(experiment == null){
    throw "experiment can't be null"
  }
  const db = await makeDb()
  let result = null
  try {
    let collection = db.collection("Experiments")
    result = await collection.insertOne(experiment);
  }
  catch (e) {
    throw e
  }
  if (result) {
    return true
  }
  return false
}

async function getExperimentsByIds(expsIds) {
  const db = await makeDb()
  let result = null
  try {
    let collection = db.collection("Experiments")
    result = await collection.find( { exp_id: { $in:expsIds} } ).toArray()
  }
  catch (e) {
    throw e
  }
  return result
}


async function getExperimentById(expId) {
  const db = await makeDb()
  let result = null
  try {
    let collection = db.collection("Experiments")
    result = await collection.findOne({ exp_id: expId }, { projection: { _id: 0 } })
  }
  catch (e) {
    throw e
  }
  return result
}


//remove after hackhton
async function getExperiments() {
  const db = await makeDb()
  let result = null
  try {
    let collection = db.collection("Experiments")
    result = await collection.find({}).toArray()
  }
  catch (e) {
    throw e
  }
  return result
}

async function getExperimentByCode(expCode) {
  const db = await makeDb()
  let result = null
  try {
    let collection = db.collection("Experiments")
    result = await collection.findOne({ exp_code: expCode })
    // result = await result.toArray() //, { exp_id: 1, _id: 0 }
    // result = result[0]
  }
  catch (e) {
    throw e
  }
  return result
}

async function insertParticipantToExp(expId, participant) {
  let username = participant.participant_twitter_username;
  let p_id_str = participant.participant_twitter_id_str
  let groupId = participant.group_id;

  let result = null
  try{
    const db = await makeDb()
    let collection = db.collection("Experiments")
    var jsonData = {
      "participant_twitter_username": username,
      "participant_twitter_id_str": p_id_str
    }
    result = await collection.updateOne(
      { exp_id: expId },
      { $inc: { num_of_participants: 1, } }
    )
    if(result != null){
      if(result.modifiedCount <= 0) // No such exp id
        return false
    }
    //we might do this update and the last update in one update but i dont want to take the risk
    result = await collection.updateOne(
      { exp_id: expId, "exp_groups.group_id": groupId },
      { $inc: { "exp_groups.$.group_num_of_participants": 1 } }
    )
    result = await collection.updateOne(
      { exp_id: expId, "exp_groups.group_id": groupId },
      {
        "$push":
        {
          "exp_groups.$.group_participants": jsonData
        }
      }
    )
  }
  catch (e) {
    console.log(e)
    return false
  }
  if (result) {
    return true
  }
  return false
}

// TODO remove after hackhton
async function deleteAllExperiments() {
  const db = await makeDb()
  let result = null
  try {
    let collection = db.collection("Experiments")
    result = await collection.deleteMany({})
  }
  catch (e) {
    return false
  }
  if (result) {
    return true
  }
  return false
}

async function updateExpStatus(expId, status) {
  const db = await makeDb()
  let result = null
  try{
    let collection = db.collection("Experiments")
    result = await collection.findOneAndUpdate({exp_id: expId}, {$set: {status: status}})
  }
  catch(e){
    throw(e)
  }
  if(result && result.lastErrorObject.updatedExisting){
    return true
  }
  return false
}

async function setExpEndDate(expId, endDate) {
  const db = await makeDb()
  let result = null
  try{
    let collection = db.collection("Experiments")
    result = await collection.findOneAndUpdate({exp_id: expId}, {$set: {end_date: endDate}})
  }
  catch(e){
    throw(e)
  }
  if(result != null){
    return true
  }
  return false
}


module.exports = {
  insertExperiment: insertExperiment,
  insertParticipantToExp: insertParticipantToExp,
  getExperimentById: getExperimentById,
  getExperimentsByIds: getExperimentsByIds,
  getExperimentByCode: getExperimentByCode,
  deleteAllExperiments: deleteAllExperiments,
  updateExpStatus : updateExpStatus,
  setExpEndDate: setExpEndDate
}