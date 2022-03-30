var express = require("express");
var router = express.Router();
const participantsService_selenium = require("../../service/participants/participantsService_selenium.js");
const database = require("../../business_logic/db/DBCommunicator.js")


/* ----------------------------------------
    Routes for asking for data from Twitter
   ---------------------------------------- */

router.get("/getWhoToFollow", async (req, res, next) => {
  const params = req.body
  // If there are no params at all,
  // Or no pass or no user params
  if(!params || !params.user || !params.pass){
    res.status(400).send("No params supplied.")
    return
  }
  try{
    const whoToFollowElement = await participantsService_selenium.getWhoToFollow(params);
    res.send(whoToFollowElement);
  }
  catch(e){
    // Decide for error statuses by the error type.
    // For example: quota ran out, or internal error
    console.log("** Error in /participant/getFeed **")
    console.log(e)
    if(e.message){ // error thrown from the api
      res.status(502).json(e);
      /* 
      502 – The server while acting as a gateway or a proxy, 
            received an invalid response from the upstream server it accessed
            in attempting to fulfill the request.
      */
    }
    else{ // Internal error
      res.sendStatus(500)
    }
  }
});


module.exports = router;
