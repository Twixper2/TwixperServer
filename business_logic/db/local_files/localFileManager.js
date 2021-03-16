//import mergeFiles from 'merge-files';
var mergeFiles = require('merge-files')

var fs = require("fs")
var path = require("path");
var watch = require('watch')
var AdmZip = require('adm-zip');
const prependFile = require('prepend-file');


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
    watch.createMonitor(requestsPath, requestPathOptions, function (monitor) {
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
    const fileName = path.basename(reportRequestFilePath, ".txt") 
    const expId = fileName 
    console.log("Creating report for experiment: " + fileName)
    const actionsDirectoryPath = experimentsDataPath + "\\" + expId 

    let actionFileNames = []
    // reading actions names
    // TODO maybe needs to be changed to an implemintation who doesn't require
    // loading all file names to ram (instead, iterating one by one)
    try {
        actionFileNames = fs.readdirSync(actionsDirectoryPath)
        actionFileNames = actionFileNames.map(file => experimentsDataPath + "\\" + expId + "\\" + file) // basenames to full path
    }
    catch (e) {
        console.log(e)
        return false
    }

    // creating merged file to temp
    const mergedFilePath = tempPath + "\\" + expId + "_A.json" 
    let mergeStatus = false
    try {
        mergeStatus = await mergeFiles(actionFileNames, mergedFilePath); // probably should be inside Promise.all with the db call
    }
    catch(e) {
        console.log("merge throwed error")
    }
    // checking merge success
    if (!mergeStatus) {
        console.log("Unable to merge files from " + actionsDirectoryPath + " to " + mergedFilePath )
        return false
    }

    // TODO: replace action files with merged file for performance improvments

    actionFileNames = null // freeing up RAM 
    
    // making the file a valid json
    let appendToStart = "{ actions_log: ["
    let appendToEnd = "] }"
    try {
        await prependFile(mergedFilePath, appendToStart) // append to start
        fs.appendFileSync(mergedFilePath, appendToEnd) // append to end
    }
    catch (e) {
        console.log("Problem appending/prepending to file")
        return false
    }
    
    // writing experiment metadata file
    // TODO: Call for DBCommunicator to get the experiment's metadata.
    // get relevant experiment from mongo (dbCommunicaotr), save it as json file 
    // to "./temp", by name "expID_EMD"
    
    // writing to zip and deleting request file and temp files
    try {
        let zipPath = outputPath + "\\" + expId + ".zip"
        let zip = new AdmZip();
        zip.addLocalFile(mergedFilePath) // adding merged file
        //zip.addLocalFile(tempPath + "\\" + expId + "_EMD") // adding experiment metadata file
        try {
            fs.writeFileSync(zipPath, zip.toBuffer()) //writing zip file
        }
        catch(e) {
            console.log("error during writing zip")
            return false
        }
        deleteFile(reportRequestFilePath) // async delete of request file, after it is done we can accept more requests
        deleteFile(mergedFilePath) // async delete of temp merged file
        deleteFile(tempPath + "\\" + expId + "_EMD") 
        return true
    }
    catch(e) {
        return false
    }
};

function deleteFile(path) {
    fs.unlink(reportRequestFilePath, (err) => { // async deleting request
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