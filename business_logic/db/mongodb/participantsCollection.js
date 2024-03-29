var makeDb = require("./DBConnector.js").makeDb

async function insertParticipant(participant) {
    if(participant == null){
        throw "participant can't be null"
    }
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
 * @param {user username} user 
*/
async function getAllActiveParticipant() {
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Participants")
        result = await collection.find().toArray()
    }
    catch(e){
        throw(e)
    }
    return result
}


/**
 * this method returns user by twitter_id_str
 * @param {user username} user 
*/
async function getParticipantByUsername(user) {
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Participants")
        result = await collection.findOne({participant_twitter_username: user})
        // result = await result.toArray()
        // result = result[0]
    }
    catch(e){
        throw(e)
    }
    return result
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

async function getParticipantByToken(token) {
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Participants")
        result = await collection.findOne({user_twitter_token: token})
        // result = await result.toArray()
        // result = result[0]
    }
    catch(e){
        throw(e)
    }
    return result
}

async function updateParticipantTokens(tId,token,token_secret) {
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Participants")
        result = await collection.findOneAndUpdate({participant_twitter_id_str: tId}, {$set: {user_twitter_token: token,user_twitter_token_secret :token_secret}}, {upsert: true});  
        // result = await result.toArray()
        // result = result[0]
    }
    catch(e){
        throw(e)
    }
    if(result != null){
        return true
    }
    return false
}

/*async function deleteParticipants() {
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
}*/

async function deleteParticipantsFromExp(expId){
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Participants")
        result = await collection.deleteMany({exp_id: expId})
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
    getParticipantByUsername : getParticipantByUsername,
    getParticipantByToken : getParticipantByToken,
    updateParticipantTokens: updateParticipantTokens,
    deleteParticipantsFromExp : deleteParticipantsFromExp,
    getAllActiveParticipant : getAllActiveParticipant
}