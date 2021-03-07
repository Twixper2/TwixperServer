const reportCreator = require("../../business_logic/researchers/experiments/experimentReportCreator")
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
async function activateNewExperiment(expObj){
    return await experiments.activateNewExperiment(expObj)
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
 * create report for experiment (two files)
 * @param {*} expId 
 */
async function createExperimentReport(expId){
    return await reportCreator.createReport(expId)
}

exports.activateNewExperiment = activateNewExperiment
exports.getExperimentsByIds = getExperimentsByIds
exports.createExperimentReport = createExperimentReport
exports.getResearcher = getResearcher
exports.registerResearcher = registerResearcher
exports.validateExpFields = validateExpFields
