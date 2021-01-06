// const { MongoClient } = require("mongodb");
// const uri = "mongodb+srv://dekellevy:dekeldekel@twixper0.jo1eq.mongodb.net/Twixper()?retryWrites=true&w=majority";
// const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});

var actionsCollection_global = null

async function loadActionsCollection(database) {
    try {
        if (!actionsCollection_global) {
            actionsCollection_global = await database.collection('Actions');
        }
    }
    catch {
        return null;
    }
}


function insertAction(action) {
    actionsCollection_global.insertOne(action, function (err, res) {
        if (err);
        return false;
      });
      return true;
}


function getExpActions(expId) {
    let output = actionsCollection_global.find({ exp_id: expId },
        { action_type: 1, action_date: 1, participant_twitter_username: 1, participant_group_id: 1, exp_id: 0 }, function (err, res) {
            if (err);
            return null;
        });
    return output;
}

function deleteActions() {
    actionsCollection_global.remove({}, function (err, res) {
        if (err);
        return false;
    });
    return true;
}
module.exports = {
    loadActionsCollection: loadActionsCollection,
    insertAction: insertAction,
    getExpActions, getExpActions,
    deleteActions: deleteActions
}