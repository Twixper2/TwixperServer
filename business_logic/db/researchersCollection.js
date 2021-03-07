var makeDb = require("./DBConnector.js").makeDb


async function addExperimentId(resId, expId) {
  let result = null
  try {
    let collection = db.collection("Researchers")
    result = await collection.updateOne(
      { researcher_id: resId },
      { $addToSet: { experiments_ids: expId } })
  }
  catch (e) {
    throw e
  }
  return result
}

async function addResearcher(researcher) {
  const db = await makeDb()
  let result = null
  try {
    let collection = db.collection("Researchers")
    result = await collection.insertOne(researcher);
  }
  catch (e) {
    throw e
  }
  return result
}


async function getResearcher(id) {
  const db = await makeDb()
  let result = null
  try {
    let collection = db.collection("Researchers")
    result = await collection.findOne({ researcher_id: id })
  }
  catch (e) {
    throw e
  }
  return result
}

//return the experiments id's of the researcher
async function getResearcherExperiments(id) {
  const db = await makeDb()
  let result = null
  try {
    let collection = db.collection("Researchers")
    result = await collection.findOne({
      researcher_id: id
    })
      .project({ experiments_ids: 1 });
    // result = await result.toArray()
    // result = result[0]
  }
  catch (e) {
    throw e
  }
  return result;
}

module.exports = {
  getResearcher: getResearcher,
  getResearcherExperiments: getResearcherExperiments,
  addResearcher: addResearcher,
  addExperimentId: addExperimentId

}