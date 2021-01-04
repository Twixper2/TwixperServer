var researchersCollection_global = null

async function loadResearchersCollection(database) {
    try {
        if (!researchersCollection_global)
            let database = await this.getDatabase()
            researchersCollection_global = await database.collection('Researchers');
    }
    catch {
        return null;
    }
}

module.exports = {
    loadResearchersCollection : loadResearchersCollection
}