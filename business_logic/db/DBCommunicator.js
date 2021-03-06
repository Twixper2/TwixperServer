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

async function getParticipantByTwitterId(tId){
    return await participantsCollection.getParticipantByTwitterId(tId);
}

async function getParticipantByToken(token){
    return await participantsCollection.getParticipantByToken(token);
}

async function updateParticipantTokens(tId, token, token_secret){
    return await participantsCollection.updateParticipantTokens(tId,token,token_secret);
}


/*
    _____ ACTIONS _____
*/
async function insertAction(action){
    await actionsCollection.insertAction(action); //TODO
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

async function addExperimentIdToResearcher(expId){
    return await researchersCollection.addExperimentId(expId);
}

async function getResearcherExperiments(researcherId){
    return await researchersCollection.getResearcherExperiments(researcherId);
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
    getExperimentsByIds: getExperimentsByIds,
    getActionsOfExperiment: getActionsOfExperiment,
    getResearcherExperiments: getResearcherExperiments,
    addExperimentIdToResearcher: addExperimentIdToResearcher,
    getExperimentById: getExperimentById,
    isExperimentExists: isExperimentExists,
    getResearcher : getResearcher,
    addResearcher : addResearcher,
    updateParticipantTokens: updateParticipantTokens
}

