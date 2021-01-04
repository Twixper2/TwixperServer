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

function insertParticipant(participant) {

}



