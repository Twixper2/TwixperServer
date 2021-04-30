const twitterComm = require("../../twitter_communicator/twitterCommunicator")
const twitterInnerApiUtils = require("../../twitter_communicator/twitter_internal_api/twitterInnerApiUtils")

async function searchTweets(q){
    let searchResults = await twitterComm.searchTweets(q)
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

    // if (results) {
    //     /** Not manipulating search results */
    //     // results.statuses = manipulator.manipulateTweets(participant.group_manipulations, results.statuses)
    //     return results
    // }
    // return null
}

async function searchUsers(q){    
    let searchResults = await twitterComm.searchUsers(q)
    const formattedResultsArr = twitterInnerApiUtils.formatSearchUsersObject(searchResults)
    return formattedResultsArr
}

exports.searchTweets = searchTweets
exports.searchUsers = searchUsers
