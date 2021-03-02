require("dotenv").config();

var experimentsCollection = require("./experimentsCollection")
var participantsCollection = require("./participantsCollection")
var researchersCollection = require("./researchersCollection")
var tweetsCollection = require("./tweetsCollection")
var actionsCollection = require("./actionsCollection")



/*
    _____ PARTICIPANTS _____
*/
async function insertParticipant(participant) {
    let expId = participant.exp_id; 
    await experimentsCollection.insertParticipantToExp(expId,participant); //find the exp id from participant 
    await participantsCollection.insertParticipant(participant);
    return true
}

async function insertAction(action){
    await actionsCollection.insertAction(action);
}

async function getParticipantByTwitterId(tId){
    return await participantsCollection.getParticipantByTwitterId(tId);
}

async function getParticipantByToken(token){
    return await participantsCollection.getParticipantByToken(token);
}

/*
    _____ Researchers _____
*/
// For Hackathon, remove after it finishes.
// Returns all the experiments in the db.
async function getExperiments(){
    return await experimentsCollection.getExperiments();
}

async function getActionsOfExperiment(expId){
    return await actionsCollection.getExpActions(expId);
}

async function getResearcher(id) {
    //TODO
}

async function addResearcher(id) {
    //TODO
}

// After Hackathon finishes:
async function getResearcherExperiments(researcherId){

}

async function insertExperiment (experiment){

    /** wipe the whole db- for testing */
    await actionsCollection.deleteActions();
    await participantsCollection.deleteParticipants();
    // await researchersCollection.deleteResearchers();
    // await tweetsCollection.deleteTweets();
    await experimentsCollection.deleteAllExperiments()

    return await experimentsCollection.insertExperiment(experiment);
    
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


module.exports = {
    getExperimentByCode : getExperimentByCode,
    insertParticipant: insertParticipant,
    getParticipantByTwitterId: getParticipantByTwitterId,
    getParticipantByToken:getParticipantByToken,
    insertAction: insertAction,
    insertExperiment : insertExperiment,
    getExperiments: getExperiments,
    getActionsOfExperiment: getActionsOfExperiment,
    getResearcherExperiments: getResearcherExperiments,
    getExperimentById: getExperimentById,
    isExperimentExists: isExperimentExists,
    getResearcher : getResearcher,
    addResearcher : addResearcher
}

