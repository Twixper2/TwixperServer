var makeDb = require("./DBConnector.js").makeDb

async function insertParticipant(participant) {
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Participants")
        result = await collection.insertOne(participant)
    }
    catch(e){
        return false
    }
    if (result) {
        return true
    }
    return false
}

/**
 * this method returns user by twitter_id_str
 * @param {user twitter id str} id 
*/
async function getParticipantByTwitterId(id) {
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Participants")
        result = await collection.findOne({participant_twitter_id_str: id})
        // result = await result.toArray()
        // result = result[0]
    }
    catch(e){
        throw(e)
    }
    return result
}

async function getParticipantByToken(id) {
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Participants")
        result = await collection.findOne({user_twitter_token: id})
        // result = await result.toArray()
        // result = result[0]
    }
    catch(e){
        throw(e)
    }
    return result
}

async function deleteParticipants() {
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Participants")
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
    insertParticipant : insertParticipant,
    getParticipantByTwitterId : getParticipantByTwitterId,
    getParticipantByToken : getParticipantByToken,
    deleteParticipants: deleteParticipants

}