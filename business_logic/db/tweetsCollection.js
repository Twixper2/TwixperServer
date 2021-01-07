var tweetsCollection_global = null

async function loadTweetsCollection(database) {
    try {
        if (!tweetsCollection_global){
            tweetsCollection_global = await database.collection('Tweets');
        }
    }
    catch {
        return null;
    }
}

function deleteTweets() {
    tweetsCollection_global.remove({}, function (err, res) {
        if (err);
        return false;
    });
    return true;
}

module.exports= {
    loadTweetsCollection : loadTweetsCollection,
    deleteTweets: deleteTweets
}