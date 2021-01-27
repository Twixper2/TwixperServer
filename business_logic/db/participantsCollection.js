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
 * TODO we need method like this by twitter token and by id
 * @param {user twiiter id} id 
*/
async function getParticipant(id) {
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
    insertParticipant: insertParticipant,
    getParticipant: getParticipant,
    deleteParticipants: deleteParticipants

}