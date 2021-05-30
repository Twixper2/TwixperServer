const dbComm = require("../../db/DBCommunicator")
const idGenerator = require("../../utils/UUIDGenerator") 
const config = require('../../../config')

var moment = require('moment');
const dateFormat = config.dateFormat

async function activateNewExperiment(expObj, researcherObj){
    // adding all fields to experiment object
    expObj.status = "active"
    expObj.start_date = moment.utc().format(dateFormat);
    expObj.num_of_participants = 0
    expObj.exp_id = idGenerator.generateUUID()
    let groupIdIndex = 11
    let expGroups = expObj.exp_groups
    // Initalizing groups and creating the injections docs objects
    let injectionObjectsArray = []
    expGroups.forEach((groupObj)=>{
        groupObj.group_id = groupIdIndex
        groupObj.group_num_of_participants = 0
        groupObj.group_participants = []
        groupIdIndex += 1
        manips = groupObj.group_manipulations
        const injectManipulation = manips.find(man => man.type == "inject")
        if(injectManipulation != null && (injectManipulation.users.length > 0 || injectManipulation.keywords.length > 0)){
            let injectionObject = {
                exp_id: expObj.exp_id,
                group_id: groupObj.group_id,
                tweets_to_inject: [],
                entities_states: []
            }
            injectManipulation.users.forEach(user => {
                injectionObject.entities_states.push(
                    {
                        type: "user",
                        entity_value: user,
                        last_updated: Date.parse('December 17, 1995 03:24:00'),
                        is_updating_now: false
                    }
                )
            });
            injectManipulation.keywords.forEach(keyword => {
                injectionObject.entities_states.push(
                    {
                        type: "keyword",
                        entity_value: keyword,
                        last_updated: Date.parse('December 17, 1995 03:24:00'),
                        is_updating_now: false
                    }
                )
            });
            injectionObjectsArray.push(injectionObject)
        }
    })
    expObj.exp_code = await generateExpCode()
    const researcherId = researcherObj.researcher_id
    if (expObj.exp_code) {
        expObj.researcher_details = {
            "researcher_id": researcherObj.researcher_id,
            "researcher_username": researcherObj.researcher_username,
            "researcher_email": researcherObj.researcher_email,
        }
        // adding exp to db and adding expId to researcher
        const isSuccessfulInsert = await dbComm.insertExperiment(expObj)
        if(isSuccessfulInsert === true){
            const isExperimentAdded = await dbComm.addExperimentIdToResearcher(researcherId, expObj.exp_id) // TODO make sure the correct order of inputs 
            if (isExperimentAdded === true) {
                // Insert the injection docs
                await dbComm.insertInjectionDocs(injectionObjectsArray)
                return expObj.exp_code
            }
            else {
                // TODO REVERSE THE INSERT ACTION!
            }
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

/**
 * change experiment status, delete participants
 * @param {string} expId 
 */
async function endExperiment(expId) {
    const endDate = moment.utc().format(dateFormat);
    let setEndDatePromise = dbComm.setExpEndDate(expId, endDate)
    let changeStatusPromise = dbComm.updateExpStatus(expId, "closed") 
    let deleteParticipantsPromise = dbComm.deleteParticipantsFromExp(expId)
    let deleteInjectionDocsPromise = dbComm.deleteInjectionDocs(expId)

    const results = await Promise.all([
        setEndDatePromise,
        changeStatusPromise, 
        deleteParticipantsPromise,
        deleteInjectionDocsPromise
    ])
    if (results[0] && results[1] && results[2] && results[3]) {
        return true
    }
    else {
        // TODO Rollback changes
        return false
    }
}

/**
 * 
 * @returns unique 6 chars exp code
 */
async function generateExpCode() {
    const MAX_ATTEMPTS = 10 // making sure we will not enter infinite loop 
    let code = null
    let attempts = 0 
    let exp = null

    code = idGenerator.generateUUID()
    code = code.substring(0, 6) //cutting first 6 chars
    exp = await dbComm.getExperimentByCode(code) 
    attempts += 1 

    while (exp != null && exp != undefined && (attempts < MAX_ATTEMPTS)) {
        code = idGenerator.generateUUID()
        code = code.substring(0, 6) //cutting first 6 chars
        exp = await dbComm.getExperimentByCode(code) 
        attempts += 1 
    }
    return code
}
exports.activateNewExperiment = activateNewExperiment
exports.getExperiments = getExperiments
exports.validateExpFields = validateExpFields
exports.endExperiment = endExperiment
