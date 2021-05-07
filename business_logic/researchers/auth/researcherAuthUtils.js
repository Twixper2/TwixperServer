const database = require("../../db/DBCommunicator");


/**
 * register participant
 * @param {researcher unique} id 
 */
async function registerResearcher(id, username, email) {
    let researcher = { 
        "researcher_id" : id,
        "researcher_username": username,
        "researcher_email": email,
        "experiments_ids": [],
    }
    return await database.addResearcher(researcher)
}

module.exports = {
    registerResearcher : registerResearcher,
}
