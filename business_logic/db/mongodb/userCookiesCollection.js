var makeDb = require("./DBConnector.js").makeDb

async function insertUserCookies(username, userCookies) {
    if(userCookies == null || username == null){
        throw "userCookies/username can't be null"
    }
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Cookies")

        result = await collection.save({
             _id: username ,
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




module.exports = {
    insertUserCookies : insertUserCookies,
    getCookiesByTwitterUserName: getCookiesByTwitterUserName
}