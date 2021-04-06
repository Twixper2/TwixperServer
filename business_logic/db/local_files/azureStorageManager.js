const saveExpActionsFuncUrl = process.env.AZURE_SAVE_EXP_ACTIONS_FUNC_URL
const initExpStorageFuncUrl = process.env.AZURE_INIT_EXP_STORAGE_FUNC_URL

const axios = require('axios')

function initExperimentStorage(expId){
    axios.post(initExpStorageFuncUrl + "&expId=" + expId)
}

function saveExpActions(expId, actions){
    axios.post(saveExpActionsFuncUrl + "&expId=" + expId, actions)
}

module.exports = {
    initExperimentStorage: initExperimentStorage,
    saveExpActions: saveExpActions
}