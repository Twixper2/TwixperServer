var express = require("express");
var router = express.Router();
const researchersService = require("../../service/researchers/researchersService.js");

// access control , checking google auth.

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

// Post and activate new experiment
router.post("/activateNewExperiment", async (req, res, next) => {
  // Checking for required fields
  const reqBody = req.body
  if(!validateExpFields(reqBody)){
    res.sendStatus(400); // Bad request
  }
  try{
    const expCode = await researchersService.activateNewExperiment(reqBody)
    res.status(201).send({exp_code: expCode})
  }
  catch(e){
    // Decide for error statuses by the error type.
    console.log(e)
    res.sendStatus(500)
  }
});

// Get all the researcher's experiments 
router.get("/myExperiments", async (req, res, next) => {
  // TODO: pass the user's cookie to the service
  try{
    const experiments = await researchersService.getExperiments()
    res.send(experiments)
  }
  catch(e){
    // Decide for error statuses by the error type.
    console.log(e)
    res.sendStatus(500)
  }
});

// Create experiment report, currently only locally in server side
router.post("/createExperimentReport", async (req, res, next) => {
  const expId = req.body.exp_id
  try{
    const successfulReportCreation = await researchersService.createExperimentReport(expId)
    if(successfulReportCreation){
      // Not 201 on purpose
      res.status(200).send({message: "Report created successfuly"})
    }
    else{
      res.sendStatus(500)
    }
  }
  catch(e){
    // Decide for error statuses by the error type.
    console.log(e)
    res.sendStatus(500)
  }
});

const legalManipulationTypes = ["mute", "inject", "pixel_media", "remove_media"]
function validateExpFields(reqBody){
  const title = reqBody.title
  const description = reqBody.description
  // Later also add researcherDetails
  const expGroups = reqBody.exp_groups
  if(title == null || description == null || expGroups == null){
    return false
  }
  if(!Array.isArray(expGroups)){
    return false
  }
  if(expGroups.length < 1){
    return false
  }
  expGroups.forEach((groupObj) => {
    const groupName = groupObj.group_name
    const groupSizePercentage = groupObj.group_size_in_percentage
    const groupManipulations = groupObj.group_manipulations
    if(groupName == null || groupSizePercentage == null || groupManipulations == null 
        || !Array.isArray(groupManipulations)){
      return false
    }
    groupManipulations.forEach((manipulation) => {
      const type = manipulation.type
      const users = manipulation.users
      const keywords = manipulation.keywords
      if(users == null && keywords == null){
        return false
      }
      if(type == null || !legalManipulationTypes.includes(type)){
        return false
      }
    })
  })
  return true
}

module.exports = router;
  