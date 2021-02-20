var express = require("express");
var router = express.Router();
const database = require("../../business_logic/db/DBCommunicator.js");
const { data } = require("../../business_logic/twitter_communicator/static_twitter_data/FeedJSON.js");
const participantsService = require("../../service/participants/participantsService.js");

// if { twitter_user_found : "true", user_registered_to_experiment : "true" }  give cookie with CURRENT tokens (if needed kill old cookies and give new)
// if { twitter_user_found : "true", user_registered_to_experiment : "false" } give cookies (regular new user registration)
// if { twitter_user_found : "false" } do nothing, respond code 400
router.post("/checkUserByCredentials", async (req, res, next) => {
  try {
    const oauthToken = req.body.oauth_token
    const oauthTokenSecret = req.body.oauth_token_secret
    if (!oauthToken || !oauthTokenSecret) {
      res.status(400).send("Not all params from oauth supllied.")
      return;
    }

    const twitter_id_str = await participantsService.getTwitterIdFromTokens(oauthToken, oauthTokenSecret)

    // no such user in twitter
    if (!twitter_id_str) {
      res.status(400).json({
        twitter_user_found : "false",
        user_registered_to_experiment : "false"
      });
      return;
    }

    // deleting old cookies if they are differnt
    if ((req.session &&  req.session.userTwitterToken && req.session.userTwitterToken!=oauthToken)
      || (req.session &&  req.session.userTwitterTokenSecret && req.session.userTwitterTokenSecret!=oauthTokenSecret)) {
        req.session.reset();
    }

    // if (req.cookies &&  req.cookies.userTwitterToken && req.cookies.userTwitterToken!=oauthToken) {
    //   res.clearCookie('userTwitterToken'); 
    // }
    // if (req.cookies &&  req.cookies.userTwitterTokenSecret && req.cookies.userTwitterTokenSecret!=oauthTokenSecret) {
    //   res.clearCookie('userTwitterTokenSecret'); 
    // }

    // giving user cookies if there aren't 
    if (!req.session.userTwitterToken) {
      req.session.userTwitterToken = oauthToken;
    }
    if (!req.session.userTwitterTokenSecret) {
      req.session.userTwitterTokenSecret = oauthTokenSecret;
    }

    // checking if user already registered to an experiment
    let user = await database.getParticipantByTwitterId(twitter_id_str)
    // user already registered to an experiment
    if (user) {
      res.status(200).json({
        twitter_user_found : "true",
        user_registered_to_experiment : "true"
      });
    }
    // user is not registered to experiment already
    else {
      res.status(200).json({
        twitter_user_found : "true",
        user_registered_to_experiment : "false"
      });
    }
  } // end try
  catch(e) {
    console.log(e)
    res.sendStatus(500);
  }
}); 


router.post("/registerToExperiment", async (req, res, next) => {
  try {
    // validate request params and cookies
    const expCode = req.body.exp_code
    if (!expCode) {
      res.status(400).send("No experiment code provided.")
      return;
    }

    if (!req.session || !req.session.userTwitterToken || !req.session.userTwitterTokenSecret) {
      res.status(401).send("Login with twitter first.");
      return;
    }

    const oauthToken = req.session.userTwitterToken
    const oauthTokenSecret = req.session.userTwitterTokenSecret       
   
    // trying registering user
    try {
      user = await participantsService.registerParticipant(oauthToken, oauthTokenSecret, expCode)
    }
    catch (e) {
      // if it is an error with message, we respond with the eror object containing "name" and "message" keys
      if (e.message) { 
        res.status(400).json(e);
      }
      throw e
    }
    if (!user) { //registration failed
      res.sendStatus(500);
    }
    res.sendStatus(200) //success
  } // end try
  catch(e) {
    console.log(e)
    res.sendStatus(500);
  }
});

/**
 * For debugging Nir don't delete this
 */
router.get("/getCookies", async (req, res, next) => {
  res.send(req.session)
});


module.exports = router;
