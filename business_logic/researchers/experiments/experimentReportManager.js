const dbComm = require("../../db/DBCommunicator")

const fs = require('fs');

/**
 * create report request for experiment (two files)
 * @param {*} expId 
 */
 async function requestExperimentReport(expId, researcher){ 
    let exp = await dbComm.getExperimentById(expId)
    if (!exp || !exp.researcher_details.researcher_id == researcher.researcher_id) {
        return false
    }
    let success = dbComm.createReportRequest(expId)
    return success
}

/**
 * return path to report file if exists and legal experiment that belongs to researcher, else null
 * 
 * @param {*} expId 
 */
async function getReportIfReady(expId, researcher){ 
    let exp = await dbComm.getExperimentById(expId)
    if (!exp || !(exp.researcher_details.researcher_id == researcher.researcher_id)) {
        throw ({message: "Illegal-experiment"})
    }
    let path = dbComm.getReportIfReady(expId)
    if (!path) {
        // checking if request really exists
        const requestExists = dbComm.checkReportRequestExists(expId)
        if (!requestExists) {
            throw { message: "request-not-exists"}
        }
    }
    return path
}

async function createExpMetadata(expId, researcher){ 
    let exp = await dbComm.getExperimentById(expId)
    if (!exp || !(exp.researcher_details.researcher_id == researcher.researcher_id)) {
        throw ({message: "Illegal-experiment"})
    }
    return await dbComm.createExpMetadata(expId, exp)
} 

async function getStreamDictForDownloadReport (expId){
    return await dbComm.getStreamDictForDownloadReport(expId);
}


exports.requestExperimentReport = requestExperimentReport
exports.getReportIfReady = getReportIfReady
exports.createExpMetadata = createExpMetadata
exports.getStreamDictForDownloadReport = getStreamDictForDownloadReport