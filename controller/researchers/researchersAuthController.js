var express = require("express");
var router = express.Router();
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_RESEARCHER_WEB);
const researcherService = require('../../service/researchers/researchersService')

router.post("/researcherValidateSession", async (req, res, next) => {
    if (req.session && req.session.researcherId) {
        const researcherId = req.session.researcherId;
        try{
            const researcher = await database.getResearcher(researcherId);
            if (researcher) {
                res.json( { "hasSession" : true } );
                return
            }
        }
        catch(e) {
            console.log(e)
            res.sendStatus(500);
        }
    }
    else{
        res.json( { "hasSession" : false } );
    }
});

/**
 * Verify the id_token, check if the researcher already in database. If so, give him cookie.
 * If not, create new researcher and give him cookie
 */
router.post("/researcherGoogleLogin", async (req, res, next) => {
    const id_token = req.body.id_token
    if (!id_token) {
        res.sendStatus(400)
    }
    try {
        
        //verify real google user
        const idTokenData = await verifyGoogleUser(id_token)
        const researcherId = idTokenData.userId  //store this id as key in user record
        const appKey = idTokenData.appClientId
        if (!researcherId || appKey != process.env.GOOGLE_CLIENT_ID_RESEARCHER_WEB ) {
            res.sendStatus(401); // not a google user or id token not for our app
        }

        // checking if already registered, if yes, give cookie and thats it
        let researcher = await researcherService.getResearcher(researcherId)
        if (researcher) {
            req.session.researcherId = researcherId
            res.sendStatus(200)
            return
        }

        // new user, register him and give cookie
        let addedResearcher = await researcherService.registerResearcher(researcherId)
        if (addedResearcher) {
            req.session.researcherId = researcherId
            res.sendStatus(200)
            return
        }
        else {
            res.sendStatus(500);
        }
    }
    catch (e) { //network failed somewhere
        console.log(e)
        res.sendStatus(500)
    }
});



async function verifyGoogleUser(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID_RESEARCHER_WEB,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userId = payload['sub']; //this is the key we will be using to identify the researcher
    const appClientId = payload['aud'] // this should be our app key
    return {
            "userId" : userId,
            "appClientId" : appClientId
        }
}

module.exports = router;
