require("dotenv").config();
//#region express configures
var express = require("express");
var path = require("path");
//var logger = require("morgan");
const session = require("client-sessions");
const cors = require("cors");



var app = express();


// Letting all origins to pass
//app.use(cors());
/*app.use(cors({origin:true,credentials: true}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
  if (req.method === "OPTIONS") {
      return res.status(200).end();
  } else {
      next();
  }
});*/


//app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
app.use(
  session({
    cookieName: "session", // the cookie key name
    secret: process.env.COOKIE_SECRET, // the encryption key
    duration: 30 * 60 * 1000, // expired after 30 minutes
    activeDuration: 5 * 60 * 1000 // if expiresIn < activeDuration,
    //the session will be extended by 5 minutes
  })
);

app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

//#endregion
const guestController = require("./controller/participants/guestsController");
const participantController  = require("./controller/participants/participantsController");
const researcherController = require("./controller/researchers/researchersController");

app.get("/", (req, res) => res.send("welcome"));

app.use("/guests", guestController);
app.use("/participants", participantController);
app.use("/researchers", researcherController);

app.get("/alive", (req, res) => {
  res.send("I'm alive");
});

app.use((req,res) => {
  res.sendStatus(404);
});

var port = process.env.PORT;
const hostname = process.env.HOSTNAME;

const server = app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
