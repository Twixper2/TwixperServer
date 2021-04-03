require("dotenv").config();
//#region express configures
var express = require("express");
var path = require("path");
var logger = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
// const session = require("client-sessions");
const localFileManager = require("./business_logic/db/local_files/localFileManager")
const config = require('./config')


var app = express();


// Letting all origins to pass
//app.use(cors());
app.use(cors({origin:true,credentials: true}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'User-Twitter-Token-Enc, User-Twitter-Token-Secret-Enc, Researcher-Id-Enc, Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
  res.header('Access-Control-Expose-Headers', 'User-Twitter-Token-Enc, User-Twitter-Token-Secret-Enc, Researcher-Id-Enc')
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
// Options for production
if(config.isProduction){
  cookieOptions = {
    sameSite: "none",
    secure: true,
    // secureProxy: true,
    // httpOnly: false,
  }
  
  //Tell Express that we're running behind a
  //reverse proxy that supplies https for you
  app.set('trust proxy', 3);

  //Add middleware that will trick Express
  //into thinking the request is secure
  app.use(function(req, res, next) {
    if(!req.headers['x-forwarded-proto']) { //req.headers['x-arr-ssl'] && 
      req.headers['x-forwarded-proto'] = 'https';
    }
    return next();
  });
  
}
else{
  cookieOptions = {
    httpOnly: false,
  } 
}

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

app.get("/", (req, res) => res.send("welcome"));

app.use("/participants", participantController);
app.use("/researchers", researcherController);
app.use(participantsAuthController);  //participant auth
app.use(researchersAuthController);  //participant auth


app.get("/alive", (req, res) => {
  res.send("I'm alive");
});


app.use((req,res) => {
  res.sendStatus(404);
});

const port =  process.env.PORT || 3000;

// const hostname = process.env.HOSTNAME;
/*const server = app.listen(port, hostname, () => {
  // Setting up the file manager
  localFileManager.setupFileManager()
  console.log(`Server running at http://${hostname}:${port}/`);
});*/

console.log("** BBB9")
// console.log(process.env.DB_NAME)
app.listen(port, () => {
  // Setting up the file manager
  /*
    TODO: Add storage to Azure's server and configure the paths to the folders
  */
 if(!config.isProduction){
  localFileManager.setupFileManager()
 }
  console.log(`Server running at http://localhost:${port}/`);
});
