var express = require("express")
var router = express.Router()
const researchersService = require("../../service/researchers/researchersService.js")
const database = require("../../business_logic/db/DBCommunicator.js")


/* Make sure user is authenticated by checking id provided in the cookie
  and append user data from db to req
  is not authorized, respond with code 401 */
router.use(async function (req, res, next) {
  if (req.session && req.session.researcherId) {
    const researcherId = req.session.researcherId;
    const researcher = await database.getResearcher(researcherId);

    if (researcher) {
        req.researcher = researcher; //every method has the user now
        next(); //go to the request
    }
    else {
      res.sendStatus(401); //user authentication failed, responde with unautorized
    }
  }
  else {
    res.sendStatus(401); //user authentication failed, responde with unautorized
  }
});

// Post and activate new experiment
router.post("/activateNewExperiment", async (req, res, next) => {
  // Checking for required fields
  let reqBody = req.body
  let researcherId = req.researcher.researcher_id
  let experiment =  JSON.parse(JSON.stringify(reqBody)) // deep copying the exp details
  if(!researchersService.validateExpFields(experiment)){
    res.sendStatus(400); // Bad request
  }
  try{
    const expCode = await researchersService.activateNewExperiment(experiment, researcherId)
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
  const researcher = req.researcher
  const experimentsIds = researcher.experiments_ids
  try{
    const experiments = await researchersService.getExperimentsByIds(experimentsIds) 
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


module.exports = router;
  