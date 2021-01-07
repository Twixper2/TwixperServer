// var makeDb = require("./DBConnector.js").makeDb

// var actionsCollection_global = makeDb()

// async function loadActionsCollection(database) {
//     try {
//         if (!actionsCollection_global) {
//             actionsCollection_global = await database.collection('Actions');
//         }
//     }
//     catch {
//         return null;
//     }
// }


// async function insertAction(action) {
//     await actionsCollection_global.insertOne(action, function (err, res) {
//         if (err)
//             return false;
//       });
//       return true;
// }


// async function getExpActions(expId) {
//     let output = await actionsCollection_global.find({ exp_id: expId },
//         { action_type: 1, action_date: 1, participant_twitter_username: 1, participant_group_id: 1, exp_id: 0 }, function (err, res) {
//             if (err)
//                 return null;
//         });
//     return output;
// }

// async function deleteActions() {
//     await actionsCollection_global.deleteMany({}, function (err, res) {
//         if (err)
//             return false;
//     });
//     return true;
// }
// module.exports = {
//     loadActionsCollection: loadActionsCollection,
//     insertAction: insertAction,
//     getExpActions, getExpActions,
//     deleteActions: deleteActions
// }