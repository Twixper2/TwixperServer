var express = require("express")
var router = express.Router()
const researchersService = require("../../service/researchers/researchersService.js")
const database = require("../../business_logic/db/DBCommunicator.js")
const archiver = require('archiver');

/* Make sure user is authenticated by checking id provided in the cookie
  and append user data from db to req
  is not authorized, respond with code 401 */
router.use(async function (req, res, next) {
  // if (req.session && req.session.researcherId) {
  if (req.header('Researcher-Id')) {
    // const researcherId = req.session.researcherId;
    const researcherId = req.header('Researcher-Id');
    try{
      const researcher = await database.getResearcher(researcherId);
      if (researcher) {
        req.researcher = researcher; //every method has the user now
        next(); //go to the request
      }
      else {
        res.sendStatus(401); //user authentication failed, responde with unautorized
      }
    }
    catch(e){
      console.log(e)
      res.sendStatus(500);
    }
  }
  else {
    res.status(428).send("Missing auth header Researcher-Id-Enc"); 
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
router.post("/requestExperimentReport", async (req, res, next) => {
  const expId = req.body.exp_id
  const researcher = req.researcher
  try{
    const requestSuccess = await researchersService.requestExperimentReport(expId, researcher)
    if(requestSuccess){
      res.sendStatus(202)
    }
    else{
      res.sendStatus(500)
    }
  }
  catch(e){
    if (e.message == "request-already-exists") {
      res.status(400).send(e.message)
      return;
    }
    console.log(e)
    res.sendStatus(500)
  }
});

// Download experiment report if it is ready - LOCAL FILES VERSION
router.get("/getReportIfReady", async (req, res, next) => {
  const expId = req.query.expId
  const researcher = req.researcher
  try{
    const path = await researchersService.getReportIfReady(expId, researcher)
    if(path){
      // if report is ready, let user download it
      res.download(path, function(error){ 
        if(error){
          console.log("Error in downloading: " + error) 
        }
        else{
          console.log("Report downloaded successfuly")
          // TODO: Delete the file in output
        }
      }); 
    }
    else{
      res.sendStatus(102) // the server has accepted the complete request, but has not yet completed it.
    }
  }
  catch(e){
    if (e.message == "request-not-exists") {
      res.status(400).send(e.message)
    }
    if (e.message =="Illegal-experiment") {
      res.status(401).send(e.message)
    }
    console.log(e)
    res.sendStatus(500)
  }
});

// End experiment- participants from the experiment well be deleted
router.post("/endExperiment", async (req, res, next) => {
  try{
    let expId = req.query.exp_id
    let researcher = req.researcher
    if (!expId || !researcher.experiments_ids.includes(expId)) { // make sure the researcher owns the experiment
      res.sendStatus(400); // Bad request
      return
    }
    let success = await researchersService.endExperiment(expId)
    if (success) {
      res.sendStatus(200)
      return
    }
    else {
      res.sendStatus(500)
      return
    } 
  }
  catch(e){
    // Decide for error statuses by the error type.
    console.log(e)
    res.sendStatus(500)
  }
});

// Download experiment report from azure (use in production only) - AZURE VERSION
router.get("/getExpReport", async (req, res, next) => {
  const expId = req.query.expId
  const researcher = req.researcher
  try{
    // Create the metadata file
    await researchersService.createExpMetadata(expId, researcher)
    // Get the stream dict
    const streamDict = await researchersService.getStreamDictForDownloadReport(expId)
    await new Promise((resolve, reject) => {  
      // create a file to stream archive data to. 
      // In case you want to directly stream output in http response of express, just grab 'res' in that case instead of creating file stream
      const output = res
      const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      });
  
      // listen for all archive data to be written
      // 'close' event is fired only when a file descriptor is involved
      output.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
      });
  
      // good practice to catch warnings (ie stat failures and other non-blocking errors)
      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          // log warning
        } else {
          // throw error
          throw err;
        }
      });
      
      // good practice to catch this error explicitly
      archive.on('error', (err) => {
        throw err;
      });    
   
      // pipe archive data to the file
      archive.pipe(output);
      
      for(const blobName in streamDict) {
          const readableStream = streamDict[blobName];
          // finalize the archive (ie we are done appending files but streams have to finish yet)
          archive.append(readableStream, { name: blobName });
          readableStream.on("error", reject);
      }
  
      archive.finalize();
      resolve();
    });
  }
  catch(e){
    console.log(e)
    res.status(500).send(JSON.stringify(e))
  }
})

module.exports = router;
  