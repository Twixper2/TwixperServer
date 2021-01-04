var tweetsCollection_global = null

async function loadTweetsCollection(database) {
    try {
        if (!tweetsCollection_global)
            let database = await this.getDatabase()
            tweetsCollection_global = await database.collection('Tweets');
    }
    catch {
        return null;
    }
}

module.exports= {
    loadTweetsCollection : loadTweetsCollection
}