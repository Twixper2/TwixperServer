var makeDb = require("./DBConnector.js").makeDb

async function insertUserCookies(username, userCookies) {
    if(userCookies == null || username == null){
        throw "userCookies/username can't be null"
    }
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Cookies")
        let user = {undefined}
        user.username = username;
        user.cookies = userCookies;

        result = await collection.save(
            { _id: username ,
             cookies: userCookies
            });
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
async function getCookiesByTwitterUserName(username) {
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Cookies")
        result = await collection.findOne({_id: username})
    }
    catch(e){
        throw(e)
    }
    return result?.cookies
}


async function updateUserCookies(tId,token,token_secret) {
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




module.exports = {
    insertUserCookies : insertUserCookies,
    getCookiesByTwitterUserName: getCookiesByTwitterUserName
}