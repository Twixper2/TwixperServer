const reportManager = require("../../business_logic/researchers/experiments/experimentReportManager")
const experiments = require('../../business_logic/researchers/experiments/researcherExperiments')
const database = require("../../business_logic/db/DBCommunicator.js");
const researcherAuthUtils = require("../../business_logic/researchers/auth/researcherAuthUtils")

/**
 * validates experiment obj is legal and can be added to db
 * @param {object to validate} experimentObj 
 */
function validateExpFields(experimentObj) {
    return experiments.validateExpFields(experimentObj)
}

/**
 * make experiment active
 * @param {} reqExpObj 
 */
async function activateNewExperiment(expObj, researcherId){
    return await experiments.activateNewExperiment(expObj, researcherId)
}

/**
 * get all researcher's experiments
 */
async function getExperimentsByIds(experimentsIds){
    return await experiments.getExperiments(experimentsIds)
}

/**
 * returns the researcher with specified id. If not exists, returns null
 * @param {researcher id} id 
 */
async function getResearcher(id) {
    return await database.getResearcher(id)
}

/**
 * add new researcher to db
 * @param {unuique id to authenticate the researcher} id 
 */
async function registerResearcher(id) {
    return await researcherAuthUtils.registerResearcher(id)
}

/**
 * create report request for experiment (two files)
 * @param {*} expId 
 */
async function requestExperimentReport(expId, researcher){ 
    return await reportManager.requestExperimentReport(expId, researcher)
}

/**
 * return path to report file if exists, else null
 * @param {*} expId 
 */
 async function getReportIfReady(expId, researcher){ 
    return await reportManager.getReportIfReady(expId, researcher)
}

async function createExpMetadata(expId, researcher){
    return await reportManager.createExpMetadata(expId, researcher)
}

async function getStreamDictForDownloadReport(expId){
    return await reportManager.getStreamDictForDownloadReport(expId)
}

async function endExperiment(expId) {
    return await experiments.endExperiment(expId)
}

exports.activateNewExperiment = activateNewExperiment
exports.getExperimentsByIds = getExperimentsByIds
exports.getResearcher = getResearcher
exports.registerResearcher = registerResearcher
exports.validateExpFields = validateExpFields
exports.requestExperimentReport = requestExperimentReport
exports.getReportIfReady = getReportIfReady
exports.createExpMetadata = createExpMetadata
exports.getStreamDictForDownloadReport = getStreamDictForDownloadReport
exports.endExperiment = endExperiment
