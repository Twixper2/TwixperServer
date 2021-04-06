const saveExpActionsFuncUrl = process.env.AZURE_SAVE_EXP_ACTIONS_FUNC_URL
const initExpStorageFuncUrl = process.env.AZURE_INIT_EXP_STORAGE_FUNC_URL
const createExpMetadataFuncUrl = process.env.AZURE_CREATE_EXP_METADATA_FUNC_URL
const { BlobServiceClient } = require("@azure/storage-blob");
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

const axios = require('axios')

function initExperimentStorage(expId){
    axios.post(initExpStorageFuncUrl + "&expId=" + expId)
}

function saveExpActions(expId, actions){
    axios.post(saveExpActionsFuncUrl + "&expId=" + expId, actions)
}

async function createExpMetadata(expId, metadataObj){
    return await axios.post(createExpMetadataFuncUrl + "&expId=" + expId, metadataObj)
}

async function getStreamDict(expId){
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
    const containerName = "exp-" + expId; 
    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const metadataBlobName = "experiment-metadata.json"
    const actionsBlobName =  "actions-log.ndjson"
    let streamDict = {}; // to have a map of blobName and it's corresponding stream
    const metadataBlobClient = containerClient.getBlobClient("experiment-metadata.json");
    const actionsBlobClient = containerClient.getAppendBlobClient("actions-log.ndjson");
    const response1 = await metadataBlobClient.download(0); // download from 0 offset 
    const response2 = await actionsBlobClient.download(0); // download from 0 offset 
    streamDict[metadataBlobName] = response1.blobDownloadStream;
    streamDict[actionsBlobName] = response2.blobDownloadStream;

    return streamDict

}

module.exports = {
    initExperimentStorage: initExperimentStorage,
    saveExpActions: saveExpActions,
    createExpMetadata: createExpMetadata,
    getStreamDict: getStreamDict,
    getStreamDictForDownloadReport: getStreamDict
}