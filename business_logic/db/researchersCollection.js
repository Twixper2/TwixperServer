var researchersCollection_global = null

async function loadResearchersCollection(database) {
    try {
        if (!researchersCollection_global){
            researchersCollection_global = await database.collection('Researchers');
        }
    }
    catch {
        return null;
    }
}

function deleteResearchers() {
    collection.remove({});
}

module.exports = {
    loadResearchersCollection : loadResearchersCollection,
    deleteResearchers: deleteResearchers
}