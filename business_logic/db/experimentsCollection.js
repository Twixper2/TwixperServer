var makeDb = require("./DBConnector.js").makeDb


// Insert new experiment
async function insertExperiment(experiment) {
  const db = await makeDb()
  let result = null
  try {
    let collection = db.collection("Experiments")
    result = await collection.insertOne(experiment);
  }
  catch (e) {
    return false
  }
  if (result) {
    return true
  }
}

//TODO: return experiments by list of ids
async function getExperimentsByIds(expsIds) {
  const db = await makeDb()
  let result = null
  try {
    
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
    result = await collection.findOne({ exp_id: expId })
    // result = await result.toArray()
    // result = result[0]
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

  let exp = await getExperimentById(expId)
  if (exp == null) { return false; }

  exp.num_of_participants++
  let groups = exp.exp_groups;
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]
    if (group.group_id == groupId) {
      group.group_participants.push(
        {
          "participant_twitter_username": username,
          "participant_twitter_id_str": p_id_str,
        });
      group.group_num_of_participants++;
    }
  }

  var jsonData = {};
  jsonData["participant_twitter_username"] = username;
  jsonData["participant_twitter_id_str"] = p_id_str;
  console.log(jsonData)
  const db = makeDb()
  let result = null
  // TODO DEKEL: Update instead of insert and delete
  try{
    let collection = db.collection("Experiments")
    console.log(collection.exp_groups)
    result =  collection.insertOne(
      { exp_id: expId},
      { $set:
        {
          "exp_groups.group_participants": jsonData
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


module.exports = {
  insertExperiment: insertExperiment,
  insertParticipantToExp: insertParticipantToExp,
  getExperimentById: getExperimentById,
  getExperimentsByIds: getExperimentsByIds,
  getExperimentByCode: getExperimentByCode,
  deleteAllExperiments: deleteAllExperiments
}