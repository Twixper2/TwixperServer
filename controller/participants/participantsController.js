var express = require("express");
var router = express.Router();
const twitterDataService = require("../../service/participants/twitterDataService.js");

// access control , checking cookie 
// router.use(function (req, res, next) {
    // Check for authentication from Twitter, 
    // and check that this user is in active experiment.

    /*if (req.session && req.session.user_id) {
      DButils.execQuery("SELECT user_id FROM users")
        .then((users) => {
          if (users.find((x) => x.user_id === req.session.user_id)) {
            req.user_id = req.session.user_id;
            next();
          }
          else throw { status: 401, message: "unauthorized" };
        })
        .catch((error) => res.send(error));
    } else {
      res.sendStatus(401);
    }*/
// });

//get my Favorites
router.get("/getFeed", async (req, res, next) => {
    //recipe_options.MyFavorites(req,res,req.user_id);
    res.send({ success: true, message: "getting feed"});
});
module.exports = router;
