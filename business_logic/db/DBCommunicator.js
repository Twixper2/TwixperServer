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
    experimentsCollection.insertExperiment(experiment);
    
}

function getExperimentByCode(expCode){
    return experimentsCollection.getExperimentByCode(expCode);

}

function insertParticipant(participant) {
    var parsedData = JSON.parse(participant);
    var expId;
    for(item in parsedData) {
        if(item=="exp_id"){
            expId=parsedData[item];
        }
    }
    experimentsCollection.insertParticipant(expId,participant); //find the exp id from participant 
    participantsCollection.insertParticipant(participant);
}

function insertAction(action){
    actionsCollection.insertAction(action);
}

function getParticipant(pId){
    return participantsCollection.getParticipant(pId);
}


// For Hackathon, remove after it finishes.
// Returns all the experiments in the db.
function getExperiments(){
    return experimentsCollection.getExperiments();
}

// For report
function getExperiment(expId){
    return experimentsCollection.getExperiment(expId);

}

function getActionsOfExperiment(expId){
    return actionsCollection.getExpActions(expId);
}

// After Hackathon finishes:
function getResearcherExperiments(researcherId){

}





