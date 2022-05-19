var makeDb = require("./DBConnector.js").makeDb

async function insertUserCookies(username, userCookies = undefined, access_token = undefined) {
    if(userCookies == undefined || username == undefined || access_token == undefined){
        throw "userCookies/username can't be null"
    }
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Cookies")

        result = await collection.save({
             _id: username ,
             cookies: userCookies,
             access_token: access_token
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

/**
 * this method returns user by twitter_id_str
 * @param {user twitter id str} id 
*/
async function getInfoByTwitterUserName(username) {
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection("Cookies")
        result = await collection.findOne({_id: username})
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
async function checkIfUserHaveCookies(username) {
    const db = await makeDb();
    let result = null;
    try{
        let collection = db.collection("Cookies");
        result = await collection.findOne({_id: username});
    }
    catch(e){
        throw(e)
    }
    if(!result?.cookies)
        return false;
    return true;
}



module.exports = {
    insertUserCookies : insertUserCookies,
    getCookiesByTwitterUserName : getCookiesByTwitterUserName,
    checkIfUserHaveCookies : checkIfUserHaveCookies,
    getInfoByTwitterUserName : getInfoByTwitterUserName
}