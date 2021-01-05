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


function getParticipantData(id){
    return collection.find({ "_id": id });
}

function getParticipant(id){
    return collection.find({ participant_twiitter_id: id});
}

module.exports = {
    loadParticipantsCollection : loadParticipantsCollection,
    insertParticipant: insertParticipant,
    getParticipant: getParticipant

}