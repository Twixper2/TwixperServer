const reportCreator = require("../../business_logic/researchers/experiments/experimentReportCreator")
const experiments = require('../../business_logic/researchers/experiments/researcherExperiments')

/**
 * make experiment active
 * @param {} reqExpObj 
 */
async function activateNewExperiment(reqExpObj){
    return await experiments.activateNewExperiment(reqExpObj)
}

/**
 * get all researcher's experiments
 */
// TODO: Send the user's cookie as a parameter
async function getExperiments(){
    return await experiments.getExperiments()
}

/**
 * create report for experiment (two files)
 * @param {*} expId 
 */
async function createExperimentReport(expId){
    return await reportCreator.createReport(expId)
}

exports.activateNewExperiment = activateNewExperiment
exports.getExperiments = getExperiments
exports.createExperimentReport = createExperimentReport
