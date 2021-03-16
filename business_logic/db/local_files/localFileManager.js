//import mergeFiles from 'merge-files';
var mergeFiles = require('merge-files')

var fs = require("fs")
var path = require("path");
var watch = require('watch')
var AdmZip = require('adm-zip');
const prependFile = require('prepend-file');
var dbc= require('../../db/DBCommunicator')
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
    const requestPathOptions = {
        interval: 5 // five seconds
    }
    watch.createMonitor(requestsPath, requestPathOptions, async function (monitor) {
        monitor.on("created", async function (file, stat) {
            // Handle new files
            await handleCreatedReportRequest(file)
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
    const docName = Date.now() + ".json" // Current timestamp
    // Make a file that contains the action, and places it under the relevent exp's folder.
    data = JSON.stringify(action, null, "\t")
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
    const docName = "arr_" + Date.now() + ".json" // indicating that this is array of objects, and current timestamp
    data = JSON.stringify(actionsArr, null, "\t")
    fs.writeFile(folderPath + docName, data, (err) => {
        if (err){
            console.log(error)
        }
    });
}

/**
 * Creates a small empty file under "requestsPath" that indicates that there is a request
 * for creating an experiment report for the exp with the id "expId".
 * @param {String} expId 
 */
function createReportRequest(expId){
    try {
        let filepath = requestsPath + "\\" + expId + ".txt\\"
        fs.closeSync(fs.openSync(filepath, 'w'));   // write empty file with expId as name
        return true
    }
    catch (e) {
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
    const mergedFilePath = tempPath + "\\" + expId + "_A.json" 
    let answers = []
    try {
        answers = await Promise.all([
            mergeFiles(actionFileNames, mergedFilePath),
            dbc.getExperimentById(expId) 
        ])
    }
    catch(e) {
        console.log("merge or db error")
    }
    console.log("experiment: " + answers[1])
    
    // checking merge success and experiment getting success
    if (!answers[0] || !answers[1]) {
        console.log("writing metadata or getting experiment from db actions failed")
        return false
    }

    // TODO: replace action files with merged file for performance improvments
    
    // making the file a valid json + writing experiment file
    let appendToStart = "{ actions_log: ["
    let appendToEnd = "] }"
    let expMetaPath = tempPath + "\\" + expId + "_EMD"
    let experiment = answers[1]
    try {
        await Promise.all([
            prependFile(mergedFilePath, appendToStart), // append to start of actions log file
            writeFile(expMetaPath, experiment) // write experiment file
        ])
        fs.appendFileSync(mergedFilePath, appendToEnd) // append to end of actions log file
    }
    catch (e) {
        console.log("Problem appending/prepending to file")
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
            console.log("error during writing zip")
            return false
        }
        deleteFile(reportRequestFilePath) // async delete of request file, after it is done we can accept more requests
        deleteFile(mergedFilePath) // async delete of temp merged file
        deleteFile(expMetaPath) // async delete of experiment metadata file
        return true
    }
    catch(e) {
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

module.exports = {
    setupFileManager: setupFileManager,
    createExperimentFolder: createExperimentFolder,
    insertAction, insertAction,
    insertActionsArray: insertActionsArray,
    createReportRequest: createReportRequest,
    getReportPath : getReportPath
}