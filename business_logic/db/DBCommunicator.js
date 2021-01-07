var experimentsCollection = require("./experimentsCollection")
var participantsCollection = require("./participantsCollection")
var researchersCollection = require("./researchersCollection")
var tweetsCollection = require("./tweetsCollection")
var actionsCollection = require("./actionsCollection")


//TO BE CHANGED AFTER HACKHATON!!
async function insertExperiment (experiment){
    // wipe the whole db
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

async function insertParticipant(participant) {
    let expId = participant.exp_id; 
    await experimentsCollection.insertParticipant(expId,participant); //find the exp id from participant 
    await participantsCollection.insertParticipant(participant);
}

async function insertAction(action){
    await actionsCollection.insertAction(action);
}

async function getParticipant(pId){
    return await participantsCollection.getParticipant(pId);
}


// For Hackathon, remove after it finishes.
// Returns all the experiments in the db.
async function getExperiments(){
    return await experimentsCollection.getExperiments();
}



async function getActionsOfExperiment(expId){
    return await actionsCollection.getExpActions(expId);
}


// After Hackathon finishes:
async function getResearcherExperiments(researcherId){

}

// TODO: exports

module.exports = {
    getExperimentByCode : getExperimentByCode,
    insertParticipant: insertParticipant,
    getParticipant: getParticipant,
    insertAction: insertAction,
    insertExperiment : insertExperiment,
    getExperiments: getExperiments,
    getActionsOfExperiment: getActionsOfExperiment,
    getResearcherExperiments: getResearcherExperiments,
    getExperimentById: getExperimentById,
    isExperimentExists: isExperimentExists

}

