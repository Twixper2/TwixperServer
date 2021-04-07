//import mergeFiles from 'merge-files';
var mergeFiles = require('merge-files')
var fs = require("fs")
var path = require("path");
var watch = require('watch')
var AdmZip = require('adm-zip');
// const prependFile = require('prepend-file');
var experimentsCollection= require('../mongodb/experimentsCollection')
const { promisify } = require("util")
const writeFile = promisify(fs.writeFile)

// https://github.com/mikeal/watch

const rootPath = process.env.FS_ROOT_FOLDER
const experimentsDataPath = process.env.FS_EXPERIMENTS_DATA_FOLDER
const reportsPath = process.env.FS_REPORTS_FOLDER
const requestsPath = process.env.FS_REPORTS_REQUESTS_FOLDER
const tempPath = process.env.FS_REPORTS_TEMP_FOLDER
const outputPath = process.env.FS_REPORTS_OUTPUT_FOLDER

function setupFileManager(){
    // Listening to reports requests in the requests folder
    const options = {
        interval: 5 // five seconds
    }
    watch.createMonitor(requestsPath, options, function (monitor) {
        monitor.on("created", function (file, stat) {
            // Handle new files
            handleCreatedReportRequest(file)
        })
        // monitor.stop(); // Stop watching
    })

}

function createExperimentFolder(expId){
    const folderPath = experimentsDataPath + "\\" + expId
    fs.mkdir(folderPath, (err) => {
        if (err){
            console.log(error)
            throw err;
        }
    });
}

/**
 * Creates a file that contains the action, and places it under the relevent exp's folder.
 * @param {Object} action 
 */
function insertAction(expId, action){
    const folderPath = experimentsDataPath + "\\" + expId + "\\"
    const timestamp = process.hrtime()
    const docName = action.action_type + " " + (timestamp[0] * 1000000000 + timestamp[1]) + ".txt" // Current timestamp
    /*  TODO: The long doc name is only for comfortable debugging. 
        Remove the action_type from the title in production.*/
        
    // Make a file that contains the action, and places it under the relevent exp's folder.
    data = JSON.stringify(action) + "\n" // Line break for appending multiple actions later.
    fs.writeFile(folderPath + docName, data, (err) => {
        if (err){
            console.log(err)
        }
    });
}

/**
 * Creates a file that contains the actions, and places it under the relevent exp's folder.
 * @param {Array} actionsArr 
 */
function insertActionsArray(expId, actionsArr){
    const folderPath = experimentsDataPath + "\\" + expId + "\\"
    const timestamp = process.hrtime()
    const docName = (timestamp[0] * 1000000000 + timestamp[1]) + ".txt" // Current timestamp
    // Convert the actions array to ndjson string
    const ndjsonActionsStr = getNdjsonFromArray(actionsArr)
    fs.writeFile(folderPath + docName, ndjsonActionsStr, (err) => {
        if (err){
            console.log(err)
        }
    });
    // actionsArr.forEach(actionObj => {
    //     insertAction(expId, actionObj)
    // });
}

/**
 * Creates a small empty file under "requestsPath" that indicates that there is a request
 * for creating an experiment report for the exp with the id "expId".
 * @param {String} expId 
 */
function createReportRequest(expId){
    let filepath = requestsPath + "\\" + expId + ".txt\\"
    try {
        if (fs.existsSync(filepath)) {
            throw {message : "request-already-exists"}
        }
    }
    catch(e) {
        if (e.message == "request-already-exists") {
            throw e
        }
        return false
    }
    try{
        fs.closeSync(fs.openSync(filepath, 'w'));   // write empty file with expId as name
        return true
    }
    catch (e) {
        console.log(e)
        return false
    }
}

/**
 * Creates the experiment report and moves it to Output folder.
 * Uses the "temp" folder for calculations.
 * assumes all actions are legal jsons but with comma at the end of each action
 * @param {String} file the path to the newly created file in requests  
 */
async function handleCreatedReportRequest(reportRequestFilePath){
    // extracting expId and actions path
    const fileName = path.basename(reportRequestFilePath, ".txt") 
    const expId = fileName 
    console.log("Creating report for experiment: " + fileName)
    const actionsDirectoryPath = experimentsDataPath + "\\" + expId 

    // reading actions names
    // TODO: maybe needs to be changed to an implemintation who doesn't require
    // loading all file names to ram (instead, iterating one by one)
    let actionFileNames = []
    try {
        actionFileNames = fs.readdirSync(actionsDirectoryPath)
        actionFileNames = actionFileNames.map(file => experimentsDataPath + "\\" + expId + "\\" + file) // basenames to full path
    }
    catch (e) {
        console.log(e)
        return false
    }


    // creating merged file to temp and getting experiment from db
    const mergedFilePath = tempPath + "\\" + expId + "_Actions.ndjson" 
    let answers = []
    try {
        answers = await Promise.all([
            mergeFiles(actionFileNames, mergedFilePath),
            experimentsCollection.getExperimentById(expId) 
        ])
    }
    catch(e) {
        console.log("merge or db error")
    }
    
    // checking merge success and experiment getting success
    if (!answers[0] || !answers[1]) {
        console.log("writing metadata or getting experiment from db actions failed")
        return false
    }

    // TODO: replace action files with merged file for performance improvments
    
    // making the file a valid json + writing experiment file
    // Remove last ","

    // let appendToStart = "{\"actions_log\":[\n"
    // let appendToEnd = "{\"action_type\":\"end of actions\"}\n]\n}"
    let expMetaPath = tempPath + "\\" + expId + "_Metadata.json"
    let experiment = answers[1]
    try {
        await Promise.all([
            // prependFile(mergedFilePath, appendToStart), // append to start of actions log file
            writeFile(expMetaPath, JSON.stringify(experiment, null, "\t")) // write experiment file
        ])
        // fs.appendFileSync(mergedFilePath, appendToEnd) // append to end of actions log file
    }
    catch (e) {
        console.log(e)
        return false
    }
    
    // writing to zip and deleting request file and temp files
    try {
        let zipPath = outputPath + "\\" + expId + ".zip"
        let zip = new AdmZip();
        zip.addLocalFile(mergedFilePath) // adding merged file
        zip.addLocalFile(expMetaPath) // adding experiment metadata file
        try {
            fs.writeFileSync(zipPath, zip.toBuffer()) //writing zip file
        }
        catch(e) {
            console.log("error during writing zip: " + e)
            return false
        }
        deleteFile(reportRequestFilePath) // async delete of request file, after it is done we can accept more requests
        deleteFile(mergedFilePath) // async delete of temp merged file
        deleteFile(expMetaPath) // async delete of experiment metadata file
        return true
    }
    catch(e) {
        console.log(e)
        return false
    }
};

/**
 * non-blocking delete of a file 
 * @param {String} path 
 */
function deleteFile(path) {
    fs.unlink(path, (err) => { // async deleting request
        if (err) console.log(err);
    }); 
}

/**
 * 
 * @param {String} expId 
 * @returns If report is ready, returns path to it. else null
 */
function getReportPath(expId) {
    let zipPath = outputPath + "\\" + expId + ".zip"
    try {
        if (fs.existsSync(zipPath)) {
            return zipPath
        }
        else {
            return null
        }
    }
    catch(err) {
        console.error(err)
        return null
    }
}

function checkReportRequestExists(expId) {
    let requestPath = requestsPath + "\\" + expId + ".txt" + "\\"
    try {
        return fs.existsSync(requestPath)
      
    }
    catch(err) {
        console.error(err)
        return null
    }
}

/**
 * Returns ndjson string from the array of objects
 * @param {Array} arrOfObjects Array of objects
 */
function getNdjsonFromArray(arrOfObjects){
    const result = [];
	for (const obj of arrOfObjects) {
		result.push(JSON.stringify(obj), '\n');
	}
    return result.join("")
}

module.exports = {
    setupFileManager: setupFileManager,
    createExperimentFolder: createExperimentFolder,
    insertAction, insertAction,
    insertActionsArray: insertActionsArray,
    createReportRequest: createReportRequest,
    getReportPath : getReportPath,
    checkReportRequestExists : checkReportRequestExists
}