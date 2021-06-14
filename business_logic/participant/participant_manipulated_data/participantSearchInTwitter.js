const twitterComm = require("../../twitter_communicator/twitterCommunicator")
const twitterInnerApiUtils = require("../../twitter_communicator/twitter_internal_api/twitterInnerApiUtils")

async function searchTweets(q, count=40){
    let searchResults = await twitterComm.searchTweets(q, count)
    if(!searchResults.globalObjects){
        // No need to format, already formatted (probably this obj is from the official api response)
        return searchResults
    }
    const formattedResultsArr = twitterInnerApiUtils.formatSearchTweetsObject(searchResults)
    // Match the official api response format
    let resObject = {
        statuses: formattedResultsArr
    }
    return resObject

}

async function searchUsers(q){    
    let searchResults = await twitterComm.searchUsers(q)
    const formattedResultsArr = twitterInnerApiUtils.formatSearchUsersObject(searchResults)
    return formattedResultsArr
}

exports.searchTweets = searchTweets
exports.searchUsers = searchUsers
