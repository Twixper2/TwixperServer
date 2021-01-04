var express = require("express");
var router = express.Router();

module.exports = router;

// We go here when we don't have a cookie.
// When the client side see that we are not log on, he send the request to here.
router.post("/login", async (req, res, next) => {
    const reqExpCode = req.body.expCode // Should be 123 fo the Hackathon.
    

    /*try{
      const tweetsSearchResults = participantsService.searchTweets(q)
      res.send(tweetsSearchResults)
    }
    catch(e){
      console.log(e)
      res.sendStatus(500)
    }*/
});