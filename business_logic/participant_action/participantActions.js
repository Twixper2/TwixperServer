const database = require("../db/DBCommunicator.js");


/** ______ Report participant action ______ **/
async function saveParticipantAction(action, user) {
    const { action_type, action_date } = action
    if (!action_type || !action_date) 
        return false

    action = { 
        "exp_id": user.exp_id,
        "action_type" : action.action_type,
        "action_date": action.action_date,
        "participant_twitter_username": "",
        "participant_group_id": user.group_id
    }

    let dbResponse = await database.insertAction(action)
    if (!dbResponse) { 
        return false 
    }
    return true
}

