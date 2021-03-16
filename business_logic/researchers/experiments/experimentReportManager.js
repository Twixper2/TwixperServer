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
        throw ({message: "Illegal experiment"})
    }
    let path = dbComm.getReportIfReady(expId)
    return path
}


// Returns true if report created successfuly
// Creates the report locally under folder "experiments_reports"
async function createReport(expId){
    // Real code:
    /*const experiment = dbComm.getExperiment(expId)
    if(experiment == null){
        return false
    }
    const expActions = dbComm.getExperimentActions(expId)
    if(expActions == null){
        return false
    }*/

    // For testing:
    const experiment = {
        "description":'asf',
        "exp_code":'123',
        "exp_groups":[
            {
                "group_id":11,
                "group_manipulations":[],
                "group_name":'My control group',
                "group_num_of_participants":0,
                "group_size_in_percentage":50,
                "group_participants": [ 
                    {"participants_twiitter_username": "Nir"}
                ],
            },
            {
                "group_id":11,
                "group_manipulations":[
                    {
                        "type":'mute',
                        "users": ['realDonaldTrump']
                    }
                ],
                "group_name":'Group Trump muted',
                "group_num_of_participants":0,
                "group_size_in_percentage":50,
                "group_participants": [ 
                    {"participants_twiitter_username": "Tal"}
                ],
            }
        ],
        "exp_id":'1546515611',
        'num_of_participants':0,
        "researcher_details":{},
        "start_date":"Wed Jan 06 2021 19:16:57 GMT+0200 (Israel Standard Time)",
        "status":'active',
        "title":'asf'
    }
    const expActions = [
        {
            "action_type" : "login",
            "action_date": "Wed Jan 06 2021 19:16:57 GMT+0200 (Israel Standard Time)",
            "participant_twiitter_username" : "Nir",
            "participant_group_id": 11
        },
        {
            "action_type" : "login",
            "action_date": "Wed Jan 06 2021 20:19:57 GMT+0200 (Israel Standard Time)",
            "participant_twiitter_username" : "Tal",
            "participant_group_id": 12
        },
    ]

    // Create here
    const docPath = './service/researchers/assets/experiments_reports/'
    const docName = "experiment_report_" + expId + ".json"
    let data = {
        experiment_details: experiment,
        actions_log: expActions
    }
    data = JSON.stringify(data, null, 3)
    fs.writeFileSync(docPath + docName, data);
    return true
}




exports.createReport = createReport
exports.requestExperimentReport = requestExperimentReport
exports.getReportIfReady = getReportIfReady