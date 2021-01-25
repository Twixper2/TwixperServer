var express = require("express");
var router = express.Router();
const database = require("../../business_logic/db/DBCommunicator.js");
const { data } = require("../../business_logic/twitter_communicator/static_twitter_data/FeedJSON.js");
const participantsService = require("../../service/participants/participantsService.js");



module.exports = router;

// When user trying to log in (new user or client side asked him to login again), we go here
// The client will give us the userId from the oauth
// TODO change from this implemintation 
router.post("/login", async (req, res, next) => {
    const expCode = req.body.exp_code 
    const oauthToken = req.body.oauth_token
    const oauthTokenSecret = req.body.oauth_token_secret

    // checking user on db
    // TODO doesnt work- db needs to be fixed
    /* TODO small problem: we don't really know if no such user OR database operation just failed.... so in db failure we create duplicate user
     ...we need to somehow distinguish. For now, we treat null as not found. a solution might be
     ...to some how check this in db layer, and treat differnetly to the 2 cases (throwing error vs return null) */
    let user = await database.getParticipant(oauthToken);

    //if no such user, creating the user
    if (!user) { 
      let exp = await database.getExperimentByCode(expCode); 
      if(exp == null){
        //no such experiment, bad request
        res.status(400).send("No such Experiment.")
        return;
      }
      let expId = exp.exp_id
      if (expId == null) { 
        res.status(400).send("No such Experiment.")
      }
      // TODO fix this in participant service - note that fields should be different now- oauth_token, oauth_token_secret added instead of participant_twiitter_id, user_twitter_token
      user = await participantsService.registerParticipant(oauthToken, oauthTokenSecret, expId)
    }

    //giving the user (new or just re logged-in) a cookie and responding with 200 and twitter username
    if (user != null) {
      let participantTwitterToken = user.oauth_token;
      res.cookie("userTwitterToken", participantTwitterToken);
      // Sending the username to the client so he can know that he is log on
      res.status(200).send(user.participant_twitter_username);
    }
    else {
      res.sendStatus(500);
    }

    /*try{
      const tweetsSearchResults = participantsService.searchTweets(q)
      res.send(tweetsSearchResults)
    }
    catch(e){
      console.log(e)
      res.sendStatus(500)
    }*/
});

router.get("/getCookies", async (req, res, next) => {
  res.send(req.cookies.userTwitterId)
});