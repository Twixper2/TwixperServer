var dbConn = require("./DBConnector.js")
var experimentsCollection = require("./experimentsCollection")
var participantsCollection = require("./participantsCollection")
var researchersCollection = require("./researchersCollection")
var tweetsCollection = require("./tweetsCollection")
var actionsCollection = require("./actionsCollection")


/* loading collections */
var database_global = dbConn.getDatabase()
participantsCollection.loadParticipantsCollection(database_global)
researchersCollection.loadResearchersCollection(database_global)
experimentsCollection.loadExperimentsCollection(database_global)
actionsCollection.loadActionsCollection(database_global)
tweetsCollection.loadTweetsCollection(database_global)

function insertExperiment (experiment){
    experimentsCollection.insertExperiment(experiment)
    // Call for more collection modules if needed.
}

function insertParticipant(participant) {
    // Insert to experimentsCollection
    // Insert to participantsCollection
}

function insertAction(action){

}

function getParticipant(pId){

}

// For Hackathon, remove after it finishes.
// Returns all the experiments in the db.
function getExperiments(){

}

// For report
function getExperiment(expId){

}

function getExperimentActions(expId){

}

// After Hackathon finishes:
function getResearcherExperiments(researcherId){

}





