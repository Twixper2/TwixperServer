var fs = require("fs")
var path = require("path");
var watch = require('watch')
// https://github.com/mikeal/watch

const rootPath = process.env.FS_ROOT_FOLDER
const experimentsDataPath = process.env.EXPERIMENTS_DATA
const reportsPath = process.env.FS_REPORTS_FOLDER
const requestsPath = process.env.FS_REPORTS_REQUESTS_FOLDER
const tempPath = process.env.FS_REPORTS_TEMP_FOLDER
const outputPath = process.env.FS_REPORTS_OUTPUT_FOLDER

function setupFileManager(){
    // Listening to reports requests in the requests folder
    const options = {
        interval: 5
    }
    watch.createMonitor(requestsPath, options, function (monitor) {
        monitor.on("created", function (file, stat) {
            // Handle new files
            handleCreatedReportRequest(file)
        })
        // monitor.stop(); // Stop watching
    })
}

/**
 * Creates a file that contains the action, and places it under the relevent exp's folder.
 * If the exp's folder not exists under "experimentsDataPath", creates it
 * @param {Object} action 
 */
function insertAction(action){
    const expId = action.exp_id
    // TODO: make a file that contains the action, and places it under the relevent exp's folder.
    // If the exp's folder not exists under "experimentsDataPath", create it.
}

/**
 * Creates a file that contains the actions, and places it under the relevent exp's folder.
 * If the exp's folder not exists under "experimentsDataPath", creates it
 * @param {Array} actionsArr 
 */
function insertActionsArray(actionsArr){
    const expId = actionsArr[0].exp_id
}

/**
 * Creates a small empty file under "requestsPath" that indicates that there is a request
 * for creating an experiment report for the exp with the id "expId".
 * @param {String} expId 
 */
function createReportRequest(expId){

}

/**
 * Creates the experiment report and moves it to Output folder.
 * Uses the "temp" folder for calculations.
 * @param {String} file the path to the newly created file  
 */
function handleCreatedReportRequest(file){
    console.log(file)
    const fileName = path.basename(file, ".txt")
    console.log(fileName)
    // TODO: Merge the files under the experiment folder.
    // TODO: Call for DBCommunicator to get the experiment's metadata.
}

/**
 * Checks if there is a completed zip report for the exp with the id "expId" under "outputPath".
 * If so, returns the path to the zip file. Else, returns null.
 * @param {String} expId 
 */
function checkForReportOutput(expId){

}

module.exports = {
    setupFileManager: setupFileManager,
    insertAction, insertAction,
    insertActionsArray: insertActionsArray,
    createReportRequest: createReportRequest,
    checkForReportOutput: checkForReportOutput
}