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
    const reqExpCode = req.body.exp_code // Should be 123 fo the Hackathon.
    const userTwitterToken = req.body.user_twitter_token

    // checking user on db
    let user = await database.getParticipant(userTwitterToken);

    //if no such user, creating the user
    if (!user) { 
      // TODO: Call getExpIdByExpCode (isExperimentExists) instead of this
      let exp = await database.getExperimentByCode(reqExpCode); 
      if(exp == null){
        //no such experiment, bad request
        res.status(400).send("No such Experiment.")
        return;
      }
      let expId = exp.exp_id
      // if (expId == null) { 
      //   res.status(400).send("No such Experiment.")
      // }
      user = await participantsService.registerParticipant(userTwitterToken, expId)
    }

    //giving the user (new or just re logged-in) a cookie and responding with 200 and twitter username
    if (user != null) {
      res.cookie("userTwitterId", user.participant_twitter_id);
      //res.cookie("userTwitterId", "exampleId");

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