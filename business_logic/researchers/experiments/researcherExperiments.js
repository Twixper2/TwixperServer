const dbComm = require("../../db/DBCommunicator")
const idGenerator = require("../../utils/UUIDGenerator") 
const config = require('../../../config')

var moment = require('moment');
const dateFormat = config.dateFormat

async function activateNewExperiment(expObj, researcherId){
    // adding all fields to experiment object
    expObj.status = "active"
    expObj.start_date = moment().format(dateFormat);
    expObj.num_of_participants = 0
    let groupIdIndex = 11
    let expGroups = expObj.exp_groups
    // Initalizing groups
    expGroups.forEach((groupObj)=>{
        groupObj.group_id = groupIdIndex
        groupObj.group_num_of_participants = 0
        groupObj.group_participants = []
        groupIdIndex += 1
        /* 
        // Lowercasing the keywords
        let groupManip = groupObj.group_manipulations
        groupManip.forEach((manip)=>{
            let manipKeywords = manip.keywords
            // Lowercasing the keywords
            for (let i = 0; i < manipKeywords.length; i++) {
                let keyword = manipKeywords[i];
                manipKeywords[i] = keyword.toLowerCase()
            }
        })*/
    })
    expObj.exp_id = idGenerator.generateUUID()
    expObj.exp_code = idGenerator.generateUUID()
    expObj.researcher_details = {}
    expObj.researcher_details.researcher_id = researcherId

    // adding exp to db and adding expId to researcher
    const isSuccessfulInsert = await dbComm.insertExperiment(expObj)
    if(isSuccessfulInsert === true){
        const isExperimentAdded = await dbComm.addExperimentIdToResearcher(researcherId, expObj.exp_id) // TODO make sure the correct order of inputs 
        if (isExperimentAdded === true) {
            return expObj.exp_code
        }
        else {
            // TODO REVERSE THE INSERT ACTION!
        }
    }
    throw "Failed to insert to db" // if adding to db failed
    // return expObj.exp_code
}

async function getExperiments(experimentsIds){
    if(experimentsIds.length == 0){
        return []
    }
    experiments = []
    experiments = dbComm.getExperimentsByIds(experimentsIds)
    if(experiments != null){
        return experiments
    }
    else{
        throw "Failed to get experiments from db"
    }
}

const legalManipulationTypes = ["mute", "inject", "pixel_media", "remove_media"]

/**
 * checking if the initial experiment object provided contains all the fields needed for
 * "activateNewExperiment" function to add more details and activate the experiment:
 * title, description, expGroups (correctly formated with manipulations etc...), 
 * @param {initial experiment object} experimentObj 
 * @returns 
 */
function validateExpFields(experimentObj) {
    if (!typeof experimentObj === 'object') {     // not an obj
        return false
    }
    // checking fileds
    const title = experimentObj.title
    const description = experimentObj.description
    // TODO Later also add researcherDetails
    const expGroups = experimentObj.exp_groups
    if(title == null || description == null || expGroups == null){
      return false
    }
    if(!Array.isArray(expGroups)){
      return false
    }
    if(expGroups.length < 1){
      return false
    }

    // validate groups
    expGroups.forEach((groupObj) => {
        if (!typeof experimentObj === 'object') {    // not an obj
            return false
        }
        const groupName = groupObj.group_name
        const groupSizePercentage = groupObj.group_size_in_percentage
        const groupManipulations = groupObj.group_manipulations
        if( !groupName || !groupSizePercentage || !groupManipulations || !Array.isArray(groupManipulations)){
            return false
        }

        // validate group manipulations
        groupManipulations.forEach((manipulation) => {
            if (!typeof manipulation === 'object') {    // not an obj
                return false
            }
            const type = manipulation.type
            const users = manipulation.users
            const keywords = manipulation.keywords
            if(users == null && keywords == null){
            return false
            }
            if(type == null || !legalManipulationTypes.includes(type)){
            return false
            }
        })
    })
    return true
}

  
exports.activateNewExperiment = activateNewExperiment
exports.getExperiments = getExperiments
exports.validateExpFields = validateExpFields
