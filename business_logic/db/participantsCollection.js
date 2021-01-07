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
async function insertParticipant(participant) {
    await participantsCollection_global.insertOne(participant, function (err, res) {
        if (err)
            return false;
    });
    return true;
}


async function getParticipant(id) {
    let output = await participantsCollection_global.find({ participant_twitter_id: id }, function (err, res) {
        if (err)
            return null;
      });
      return output;
    // return participantsCollection_global == null
}

async function deleteParticipants() {
    await participantsCollection_global.remove({}, function (err, res) {
            if (err)
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