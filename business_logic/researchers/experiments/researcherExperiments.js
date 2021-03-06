const dbComm = require("../../db/DBCommunicator")
const idGenerator = require("../../utils/UUIDGenerator") 

async function activateNewExperiment(expObj){
    // Add more fields
    expObj.status = "active"
    expObj.start_date = new Date()
    expObj.num_of_participants = 0
    let groupIdIndex = 11
    let expGroups = expObj.exp_groups
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
    const isSuccessfulInsert = await dbComm.insertExperiment(expObj)
    if(isSuccessfulInsert === true){
        return expObj.exp_code
    }
    else{
        throw "Failed to insert to db"
    }
    // return expObj.exp_code
}

async function getExperiments(experiments_ids){
    experiments = []
    experiments_ids.forEach(function(exp_id) {
        experiment = await dbComm.getExperimentById(exp_id)
        if (experiment) {
            experiments.push(experiment)
        }
    });
    if(experiments != null){
        return experiments
    }
    else{
        throw "Failed to get experiments from db"
    }
}

const legalManipulationTypes = ["mute", "inject", "pixel_media", "remove_media"]


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
