var participantsCollection_global = null

async function loadParticipantsCollection(database) {
    try {
        if (!participantsCollection_global)
            let database = await this.getDatabase()
            participantsCollection_global = await database.collection('Participants');
        return participantsCollection_global
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
