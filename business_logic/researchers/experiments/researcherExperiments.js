const dbComm = require("../../db/DBCommunicator")

async function activateNewExperiment(reqExpObj){
    // Deep copy the reqExpObj
    let expObj = JSON.parse(JSON.stringify(reqExpObj))
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
    // TODO: call for library to decide exp code and id
    expObj.exp_id = "1546515611"
    expObj.exp_code = "123"
    const isSuccessfulInsert = await dbComm.insertExperiment(expObj)
    if(isSuccessfulInsert === true){
        return expObj.exp_code
    }
    else{
        throw "Failed to insert to db"
    }
    // return expObj.exp_code
}

// TODO: Send the user's cookie as a parameter
async function getExperiments(){
    const experiments = dbComm.getExperiments()
    if(experiments != null){
        return experiments
    }
    else{
        throw "Failed to get experiments from db"
    }
}

exports.activateNewExperiment = activateNewExperiment
exports.getExperiments = getExperiments
