var makeDb = require("./DBConnector.js").makeDb

async function addResearcher(id) {
    const db = await makeDb()
    let result = null
    try {
      let collection = db.collection("Researchers")
      const doc = { researcher_id: id };
      result = await collection.insertOne(doc);
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
      // result = await result.toArray()
      // result = result[0]
    }
    catch (e) {
      throw e
    }
    return result
  }

  async function getResearcherExperiments(id) {
    const db = await makeDb()
    let result = null
    try {
      let collection = db.collection("Researchers")
      result= await collection.findOne({
        researcher_id: id
      })
      .project({ experiments_ids: 1});
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
    addResearcher: addResearcher

}