// Responsible for redirecting requests to "localFileMangaer" or "azureStorageManager"

const config = require("../../../config")
var localFileManager = require("./localFileManager")
var azureStorageManager = require("./azureStorageManager")

const isProduction = config.isProduction

function setupFileManager(){
    if(!isProduction){
        localFileManager.setupFileManager()
    }
}

// Should be called when experiment is created
async function initExperimentFiles(expId){
    if(isProduction){
        return await azureStorageManager.initExperimentStorage(expId)
    }
    else{ // call for the local file manager
        return await localFileManager.createExperimentFolder(expId)
    }
}

function insertAction(expId, action){
    if(isProduction){
        return azureStorageManager.saveExpActions(expId, action)
    }
    else{ // call for the local file manager
        return localFileManager.insertAction(expId, action)
    }
}

function insertActionsArray(expId, actionsArr){
    if(isProduction){
        return azureStorageManager.saveExpActions(expId, actionsArr)
    }
    else{ // call for the local file manager
        return localFileManager.insertActionsArray(expId, actionsArr)
    }
}

/* ------------------------------------
    Only for local files (localhost) 
    ----------------------------------
*/
function createReportRequest(expId) {
    if(isProduction){
        throw "The funciton 'createReportRequest' is not supported in production"
    }
    else{ // call for the local file manager
        return localFileManager.createReportRequest(expId)
    }
}

function getReportPath(expId) {
    if(isProduction){
        throw "The funciton 'getReportIfReady' is not supported in production"
    }
    else{ // call for the local file manager
        return localFileManager.getReportPath(expId)
    }
}

function checkReportRequestExists(expId) {
    if(isProduction){
        throw "The funciton 'checkReportRequestExists' is not supported in production"
    }
    else{ // call for the local file manager
        return localFileManager.checkReportRequestExists(expId)
    }
}

function createExpMetadata(expId, metadataObj){
    if(isProduction){
        // return await azureStorageManager.createExpMetadata(expId, metadataObj)
    }
    else{
        return localFileManager.CreateExpMetadataLocal(expId, metadataObj)
    }
}

/* ------------------------------------
    Only for azure
    ----------------------------------
*/
async function createExpMetadata(expId, metadataObj){
    if(isProduction){
        return await azureStorageManager.createExpMetadata(expId, metadataObj)
    }
    else{
        return localFileManager.CreateExpMetadataLocal(expId, metadataObj)
        }
}

async function getStreamDictForDownloadReport(expId){
    if(isProduction){
        return await azureStorageManager.getStreamDictForDownloadReport(expId)
    }
    else{ 
        throw "The funciton 'getStreamDictForDownloadReport' is only supported in production"
    }
}


module.exports = {
    setupFileManager: setupFileManager,
    initExperimentFiles: initExperimentFiles,
    insertAction, insertAction,
    insertActionsArray: insertActionsArray,
    createReportRequest: createReportRequest,
    getReportPath : getReportPath,
    checkReportRequestExists : checkReportRequestExists,
    createExpMetadata: createExpMetadata,
    getStreamDictForDownloadReport: getStreamDictForDownloadReport
}