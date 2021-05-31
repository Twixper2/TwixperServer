const dbComm = require("../../db/DBCommunicator")
const params = require("../../../config").injectionParams
const participantSearchInTwitter = require("../participant_manipulated_data/participantSearchInTwitter")
const participantSpecifiedTwitterData = require("../participant_manipulated_data/participantSpecifiedTwitterData");

async function getInjectionDoc(expId, groupId){
    return await dbComm.getInjectionDoc(expId, groupId)
}

function getNotUpdatedEntities(entitiesStates){
    let notUpdatedEnts = []
    entitiesStates.forEach(element => {
        if(!element.is_updating_now){
            const lastUpdated = element.last_updated
            const timeNow = Date.parse(new Date())
            const diffTime = timeNow - lastUpdated;
            if(diffTime > params.updateTimeInMili){
                // Not up-to-date
                notUpdatedEnts.push(element)
            }
        }
    });
    return notUpdatedEnts
}

/* 
    Takes the original array and updates the "is_updating_now" field for
    the objects that are in entitiesStatesToChange.
    Then calling for update to the doc in the db.
*/
async function changeIsUpdatingStatus(expId, groupId, entitiesStates, entitiesStatesToChange, newStatus){
    entitiesStatesToChange.forEach(entToChange => {
        let originalEntity = entitiesStates.find(ent => ent.type == entToChange.type 
            && ent.entity_value == entToChange.entity_value)
        originalEntity.is_updating_now = newStatus
    });
    return await dbComm.updateEntitiesState(expId, groupId, entitiesStates)
}

async function updateInjectionTweets(participant, injectionDoc, entitiesStatesToUpdateBy){
    let newTweetsToInject = injectionDoc.tweets_to_inject
    let usernames = []
    let keywords = []
    entitiesStatesToUpdateBy.forEach(ent => {
        if(ent.type == "user"){
            usernames.push(ent.entity_value)
        }
        else if(ent.type == "keyword"){
            keywords.push(ent.entity_value)
        }
    });
    let promises = []
    const tweetsPerUser = params.tweetsPerUser
    const tweetsPerKeyword = params.tweetsPerKeyword
    usernames.forEach(username => {
        let promise = participantSpecifiedTwitterData.getUserTimelineFromOfficialApi(participant, username, tweetsPerUser)
        promises.push(promise)
    });
    keywords.forEach(keyword => {
        let promise = participantSearchInTwitter.searchTweets(keyword, tweetsPerKeyword)
        promises.push(promise)
    });
    const responses = await Promise.all(promises).catch(
        function(err){
            console.log(err)
            return []
        }
    )
    let newTweets = []
    responses.forEach(response => {
        if(response && !response.statuses){
            newTweets.push(...response)
        }
        else if(response.statuses){ // results from search request
            newTweets.push(...response.statuses)
        }
    });
    // Merge 
    newTweetsToInject.push(...newTweets)
    // Remove duplications (tweets with the same id, happens when the user did not posted much recently)
    newTweetsToInject = Array.from(new Set(newTweetsToInject.map(a => a.id_str)))
    .map(id_str => {
        return newTweetsToInject.find(a => a.id_str === id_str)
    })
    // Sort by tweet id
    newTweetsToInject.sort((a, b) => (a.id_str > b.id_str) ? -1 : 1)
    // Keep only the first "injectedTweetsSizeInDoc" tweets 
    newTweetsToInject = newTweetsToInject.slice(0, params.injectedTweetsSizeInDoc)
    
    // Updating the state of the entities
    let entitiesStates = injectionDoc.entities_states
    entitiesStatesToUpdateBy.forEach(entToChange => {
        let originalEntity = entitiesStates.find(ent => ent.type == entToChange.type 
            && ent.entity_value == entToChange.entity_value)
        originalEntity.is_updating_now = false
        originalEntity.last_updated = Date.parse(new Date())
    });
    injectionDoc.entities_states = entitiesStates
    injectionDoc.tweets_to_inject = newTweetsToInject
    // Call for "replaceInjectionDoc" 
    await dbComm.replaceInjectionDoc(injectionDoc.exp_id, injectionDoc.group_id, injectionDoc)
}

function injectTweets(feedTweets, tweetsToInject){
    if(feedTweets.length <= 1){ // Feed is empty
        return tweetsToInject
    }
    const fromId = feedTweets[feedTweets.length - 1].id_str
    const toId = feedTweets[0].id_str
    const maxNumTweetsToInject = params.numTweetsToInject
    let totalInjected = 0
    tweetsToInject.forEach(tweet => {
        const tweetId = tweet.id_str
        if(totalInjected <= maxNumTweetsToInject && tweetId > fromId &&  tweetId < toId){
            feedTweets.push(tweet)
            totalInjected ++
        }
    });
    // Sort the feed by tweet id
    feedTweets.sort((a, b) => (a.id_str > b.id_str) ? -1 : 1)

    // Remove duplications (tweets with the same id)
    const uniqueFeedTweets = Array.from(new Set(feedTweets.map(a => a.id_str)))
    .map(id_str => {
      return feedTweets.find(a => a.id_str === id_str)
    })
    return uniqueFeedTweets
}

function shuffleArray(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

exports.getInjectionDoc = getInjectionDoc
exports.getNotUpdatedEntities = getNotUpdatedEntities
exports.shuffleArray = shuffleArray
exports.changeIsUpdatingStatus = changeIsUpdatingStatus
exports.updateInjectionTweets = updateInjectionTweets
exports.injectTweets = injectTweets