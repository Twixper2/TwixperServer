var express = require("express");
var router = express.Router();
const researchersControoller = require("../../service/researchers/researchersService.js");

//get my Favorites
router.get("/getExperiments", async (req, res, next) => {
    //recipe_options.MyFavorites(req,res,req.user_id);
    res.send({ success: true, message: "getting feed"});
  });

module.exports = router;
  