var participantsCollection_global = null

async function loadParticipantsCollection(database) {
    try {
        if (!participantsCollection_global){
            participantsCollection_global = await database.collection('Participants');
        }
    }
    catch {
        return null;
    }
}

function insertParticipant (participant){
    collection.insert(participant);
}


function getParticipant(id){
    return collection.find({ participant_twiitter_id: id});
}

function deleteParticipants() {
    collection.remove({});
}

module.exports = {
    loadParticipantsCollection : loadParticipantsCollection,
    insertParticipant: insertParticipant,
    getParticipant: getParticipant,
    deleteParticipants: deleteParticipants

}