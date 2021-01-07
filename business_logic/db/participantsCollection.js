var participantsCollection_global = null

async function loadParticipantsCollection(database) {
    try {
        if (!participantsCollection_global) {
            participantsCollection_global = await database.collection('Participants');
        }
    }
    catch {
        return null;
    }
}
function insertParticipant(participant) {
    participantsCollection_global.insertOne(participant, function (err, res) {
        if (err);
        return false;
    });
    return true;
}


function getParticipant(id) {
    let output = participantsCollection_global.find({ participant_twitter_id: id }, function (err, res) {
        if (err);
        return null;
      });
      return output;
    // return participantsCollection_global == null
}

function deleteParticipants() {
        participantsCollection_global.remove({}, function (err, res) {
            if (err);
            return false;
        });
        return true;
    
}

module.exports = {
    loadParticipantsCollection: loadParticipantsCollection,
    insertParticipant: insertParticipant,
    getParticipant: getParticipant,
    deleteParticipants: deleteParticipants

}