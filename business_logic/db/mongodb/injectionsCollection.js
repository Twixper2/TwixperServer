var makeDb = require("./DBConnector.js").makeDb
const collectionName = "Injections"

// Insert injection docs
async function insertInjectionDocs(injectionObjectsArray) {
    const db = await makeDb()
    let result = null
    // this option prevents additional documents from being inserted if one fails
    const options = { ordered: true };
    try {
        let collection = db.collection(collectionName)
        result = await collection.insertMany(injectionObjectsArray, options);
    }
    catch (e) {
        throw e
    }
    if (result) {
        return true
    }
    return false
}

async function getInjectionDoc(expId, groupId){
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection(collectionName)
        result = await collection.findOne({exp_id: expId, group_id: groupId})
    }
    catch(e){
        throw(e)
    }
    return result
}

async function updateEntitiesState(expId, groupId, newEntitiesState){
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection(collectionName)
        result = await collection.updateOne(
            { exp_id: expId, group_id: groupId },
            {
              $set:
              {
                entities_states: newEntitiesState
              }
            }
        )
    }
    catch(e){
        throw(e)
    }
    if (result) {
        return true
    }
    return false
}

async function replaceInjectionDoc(expId, groupId, docToReplaceWith){
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection(collectionName)
        result = await collection.replaceOne({exp_id: expId, group_id: groupId}, docToReplaceWith)
    }
    catch(e){
        console.log(e)
        throw(e)
    }
    if (result) {
        return true
    }
    return false
}

async function deleteInjectionDocs(expId){
    const db = await makeDb()
    let result = null
    try{
        let collection = db.collection(collectionName)
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
    insertInjectionDocs: insertInjectionDocs,
    getInjectionDoc: getInjectionDoc,
    deleteInjectionDocs: deleteInjectionDocs,
    replaceInjectionDoc: replaceInjectionDoc,
    updateEntitiesState: updateEntitiesState,
}