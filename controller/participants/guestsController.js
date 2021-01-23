var express = require("express");
var router = express.Router();
const database = require("../../business_logic/db/DBCommunicator.js");
const { data } = require("../../business_logic/twitter_communicator/static_twitter_data/FeedJSON.js");
const participantsService = require("../../service/participants/participantsService.js");



module.exports = router;

// When user trying to log in (new user or client side asked him to login again), we go here
// The client will give us the userId from the oauth
// TODO change from thi implemintation 
router.post("/login", async (req, res, next) => {
    const expCode = req.body.exp_code // Should be 123 fo the Hackathon.
    const oauthToken = req.body.oauth_token
    const oauthTokenSecret = req.body.oauth_token_secret


    // checking user on db
    // TODO doesnt work- db needs to be fixed
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
      // fix this in DB
      user = await participantsService.registerParticipant(oauthToken, oauthTokenSecret, expId)
    }

    //giving the user (new or just re logged-in) a cookie and responding with 200 and twitter username
    if (user != null) {
      let participantTwitterId = user.participant_twitter_id;
      res.cookie("userTwitterId", participantTwitterId);
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