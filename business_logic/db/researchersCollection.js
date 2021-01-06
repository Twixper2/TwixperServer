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
    researchersCollection_global.remove({}, function (err, res) {
        if (err);
        return false;
    });
    return true;
}

module.exports = {
    loadResearchersCollection : loadResearchersCollection,
    deleteResearchers: deleteResearchers
}