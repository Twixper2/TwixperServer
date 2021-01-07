var makeDb = require("./DBConnector.js").makeDb

async function insertParticipant(participant) {
    const db = await makeDb()
    let result = null
    try{
        collection = db.collection("Participants")
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


async function getParticipant(id) {
    const db = await makeDb()
    let result = null
    try{
        collection = db.collection("Participants")
        result = await collection.findOne({participant_twitter_id: id})
    }
    catch(e){
        return null
    }
    return result
}

async function deleteParticipants() {
    const db = await makeDb()
    let result = null
    try{
        collection = db.collection("Participants")
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