require("dotenv").config();

var experimentsCollection = require("./mongodb/experimentsCollection")
var participantsCollection = require("./mongodb/participantsCollection")
var researchersCollection = require("./mongodb/researchersCollection")
var injectionsCollection = require("./mongodb/injectionsCollection")
var userCookiesCollection = require("./mongodb/userCookiesCollection")
var fileManager = require("./local_files/fileManager")
/**
 * userCookies
 */
 async function insertUserCookies(username, userCookies = undefined, access_token = undefined) {
    if(userCookies == undefined || username == undefined || access_token == undefined){
        throw "userCookies / username / accessToken can't be null"
    }
    return await userCookiesCollection.insertUserCookies(username, userCookies, access_token);

}

/**
 * this method returns user by twitter_id_str
 * @param {user twitter id str} id 
*/
async function getInfoByTwitterUserName(username) {
    if(username == undefined){
        throw "username can't be null"
    }
    return await userCookiesCollection.getInfoByTwitterUserName(username);
}

/*
    _____ PARTICIPANTS _____
*/
async function insertParticipant(participant) {
    if(participant == null){
        throw "participant argument is null"
    }
    let expId = participant.exp_id; 
    await experimentsCollection.insertParticipantToExp(expId,participant); //find the exp id from participant 
    await participantsCollection.insertParticipant(participant);
    return true
}
async function getAllActiveParticipant(){
    return await participantsCollection.getAllActiveParticipant();
}

async function getParticipantByUsername(user){
    return await participantsCollection.getParticipantByUsername(user);
}

async function getParticipantByTwitterId(tId){
    return await participantsCollection.getParticipantByTwitterId(tId);
}

async function getParticipantByToken(token){
    return await participantsCollection.getParticipantByToken(token);
}


async function updateParticipantTokens(tId, token, token_secret){
    return await participantsCollection.updateParticipantTokens(tId,token,token_secret);
}

async function deleteParticipantsFromExp(expId){
    return await participantsCollection.deleteParticipantsFromExp(expId);
}


/*
    _____ ACTIONS _____
*/
function insertAction(expId, action){
    fileManager.insertAction(expId, action); 
}

function createReportRequest(expId) {
    return fileManager.createReportRequest(expId)
}

function getReportIfReady(expId) {
    return fileManager.getReportPath(expId)
}
function insertActionsArray(expId, actionsArr){
    fileManager.insertActionsArray(expId, actionsArr); 
}

function checkReportRequestExists(expId) {
    fileManager.checkReportRequestExists(expId)
}


/*
    _____ Injections _____
*/

async function insertInjectionDocs(injectionObjectsArray) {
    return await injectionsCollection.insertInjectionDocs(injectionObjectsArray)
}

async function getInjectionDoc(expId, groupId){
    return await injectionsCollection.getInjectionDoc(expId, groupId)
}

async function updateEntitiesState(expId, groupId, newEntitiesState){
    return await injectionsCollection.updateEntitiesState(expId, groupId, newEntitiesState)
}

async function replaceInjectionDoc(expId, groupId, docToReplaceWith){
    return await injectionsCollection.replaceInjectionDoc(expId, groupId, docToReplaceWith)
}

async function deleteInjectionDocs(expId){
    return await injectionsCollection.deleteInjectionDocs(expId)
}

/*
    _____ Researchers _____
*/

// Returns the experiments in the db by ids.
async function getExperimentsByIds(experimentIds){
    return await experimentsCollection.getExperimentsByIds(experimentIds);
}

async function getActionsOfExperiment(expId){
    return await actionsCollection.getExpActions(expId);
}

async function getResearcher(id) {
    return await researchersCollection.getResearcher(id);
  }

async function addResearcher(researcher) {
    return await researchersCollection.addResearcher(researcher);
}

async function addExperimentIdToResearcher(resId, expId){
    return await researchersCollection.addExperimentId(resId, expId);
}

/*async function getResearcherExperiments(researcherId){
    return await researchersCollection.getResearcherExperiments(researcherId);
}*/

async function insertExperiment (experiment){

    // /** wipe the whole db- for testing */
    // await actionsCollection.deleteActions();
    // await participantsCollection.deleteParticipants();
    // // await researchersCollection.deleteResearchers();
    // // await tweetsCollection.deleteTweets();
    // await experimentsCollection.deleteAllExperiments()

    await experimentsCollection.insertExperiment(experiment);
    await fileManager.initExperimentFiles(experiment.exp_id);
    return true
}

async function getExperimentByCode(expCode){
    return await experimentsCollection.getExperimentByCode(expCode);

}
//return the whole experience
async function getExperimentById(expId){
    return await experimentsCollection.getExperimentById(expId);

}

// For report
async function getExperimentById(expId){
    return await experimentsCollection.getExperimentById(expId);

}

 //returns experiment ID if experiment with the code provided exists, else null
async function isExperimentExists(reqExpCode) {

}

async function updateExpStatus(expId, status) {
    return await experimentsCollection.updateExpStatus(expId, status);
}

async function setExpEndDate(expId, endDate) {
    return await experimentsCollection.setExpEndDate(expId, endDate);
}

async function createExpMetadata (expId, metadataObj){
    return await fileManager.createExpMetadata(expId, metadataObj);
}

async function getStreamDictForDownloadReport (expId){
    return await fileManager.getStreamDictForDownloadReport(expId);
}


module.exports = {
    getExperimentByCode : getExperimentByCode,
    insertParticipant: insertParticipant,
    getParticipantByTwitterId: getParticipantByTwitterId,
    getParticipantByToken:getParticipantByToken,
    insertAction: insertAction,
    insertActionsArray: insertActionsArray,
    insertExperiment : insertExperiment,
    insertInjectionDocs: insertInjectionDocs,
    replaceInjectionDoc: replaceInjectionDoc,
    updateEntitiesState: updateEntitiesState,
    getInjectionDoc: getInjectionDoc,
    getExperimentsByIds: getExperimentsByIds,
    getActionsOfExperiment: getActionsOfExperiment,
    // getResearcherExperiments: getResearcherExperiments,
    addExperimentIdToResearcher: addExperimentIdToResearcher,
    getExperimentById: getExperimentById,
    isExperimentExists: isExperimentExists,
    getResearcher : getResearcher,
    addResearcher : addResearcher,
    updateParticipantTokens: updateParticipantTokens,
    createReportRequest: createReportRequest,
    getReportIfReady : getReportIfReady,
    checkReportRequestExists : checkReportRequestExists,
    createExpMetadata: createExpMetadata,
    getStreamDictForDownloadReport: getStreamDictForDownloadReport,
    deleteParticipantsFromExp : deleteParticipantsFromExp,
    deleteInjectionDocs : deleteInjectionDocs,
    updateExpStatus : updateExpStatus,
    setExpEndDate : setExpEndDate,
    insertUserCookies : insertUserCookies,
    getInfoByTwitterUserName : getInfoByTwitterUserName,
    getParticipantByUsername : getParticipantByUsername,
    getAllActiveParticipant : getAllActiveParticipant
}

