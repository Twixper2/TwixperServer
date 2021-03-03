const database = require("../../db/DBCommunicator");


/**
 * register participant
 * @param {researcher unique} id 
 */
async function registerResearcher(id) {
    let researcher = { 
        "researcher_id" : id,
        "experiments_ids": [],
    }
    await database.addResearcher(researcher)
}

module.exports = {
    registerResearcher : registerResearcher,
}
