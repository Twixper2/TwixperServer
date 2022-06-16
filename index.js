require("dotenv").config();
//#region express configures
var express = require("express");
var path = require("path");
var logger = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
// const session = require("client-sessions");
const fileManager = require("./business_logic/db/local_files/fileManager")
const config = require('./config')
var isProd = false;
var app = express();


// Letting all origins to pass
//app.use(cors());
app.use(cors({origin:true,credentials: true}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'User-Twitter-Token, User-Twitter-Token-Secret, Researcher-Id, Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
  res.header('Access-Control-Expose-Headers', 'User-Twitter-Token, User-Twitter-Token-Secret, Researcher-Id')
  if (req.method === "OPTIONS") {
      return res.status(200).end();
  } else {
      next();
  }
});


app.use(logger("dev")); //logger
app.use(bodyParser.urlencoded({ extended:true})); //parse application/x-www-form-urlencoded   
app.use(bodyParser.json({limit: '3mb'})); //parse json
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files


/*
app.use(
  session({
    // proxy:config.isProduction,
    cookieName: "session", // the cookie key name
    secret: process.env.COOKIE_SECRET, // the encryption key
    duration: 1000 * 60 * 60 * 24 * 365, // expired after 365 days
    // activeDuration: 5 * 60 * 1000, // if expiresIn < activeDuration,
    cookie: cookieOptions
  })
);
*/
//#endregion
const participantsAuthController = require("./controller/participants/participantsAuthController");
const researchersAuthController = require("./controller/researchers/researchersAuthController");
const participantController  = require("./controller/participants/participantsController");
const researcherController = require("./controller/researchers/researchersController");

const participantsAuthController_selenium = require("./controller/participants/participantsAuthController_selenium");
const participantsController_selenium  = require("./controller/participants/participantsController_selenium");

/**
 * Here will be a setInterval to check
   for push notifications
   example - setinterval(checkForPushNot , 50000ms);
*/

app.get("//", (req, res) => res.send("welcome v.2"));

// app.use("//participants", participantController);
app.use("/researchers", researcherController);
// app.use(participantsAuthController);  //participant auth
app.use(researchersAuthController);  //participant auth

app.use("//participants", participantsController_selenium);
app.use(participantsAuthController_selenium);  //participant auth


app.get("//alive", (req, res) => {
  res.send("I'm alive");
});


app.use((req,res) => {
  res.sendStatus(404);
});

const port =  process.env.PORT || 3000;


if(isProd){
  // configure Https
  let fs = require('fs');
  let privateKey  = fs.readFileSync('C:\\Program Files\\Git\\usr\\bin\\privateKey.key', 'utf8');
  let certificate = fs.readFileSync('C:\\Program Files\\Git\\usr\\bin\\certificate.crt', 'utf8');
  let credentials = {key: privateKey, cert: certificate};
  let https = require('https');
  let httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443, () => {
    // Setting up the file manager
    fileManager.setupFileManager()
    console.log(`Server running at https://localhost:443/`);
  });
}
else{  
  app.listen(port, () => {
    // Setting up the file manager
    fileManager.setupFileManager()
    console.log(`Server running at http://localhost:${port}/`);
  });
}


// console.log("** BBB10") // For identifying versions in azure
// console.log(process.env.DB_NAME)

//   console.log(`Server running at http://localhost:${port}/`);
// });
