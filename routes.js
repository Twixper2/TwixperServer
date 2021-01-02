
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://dekellevy:dekeldekel@twixper0.jo1eq.mongodb.net/Twixper()?retryWrites=true&w=majority";


const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});

async function run() {
  try {
    await client.connect();

    const database = client.db('Twixper');
    const collection = database.collection('Users');
    const query = { _id: 2, name: 'nir dz' }; 
    const user = await collection.insertOne(query);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
//run().catch(console.dir);


const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

var express = require("express");
var router = express.Router();
var url = "mongodb://localhost:27017/";

router.get('/getUsersCollection', function (req, res, next) {
  var resultArray = [];
  client.connect(url, function (err, db) {
    assert.equal(null, err) 
    var cursor = db.collection('Users').find();
    cursor.forEach(function (doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function () {
      db.close();

    });
  });
});




/*router.post('/insert', function (req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: runInNewContext.body.author
  };

  mongo.content(url, function (err, db) {
    assert.equal(null, err);
    db.collection('Users').insertOne(item, function (err, result) {//TOOD:check how to choose the right collection you want to insert to
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    })
  })
});

router.post('/update', function (req, res, next) {

});

router.post('/delete', function (req, res, next) {
});
 */