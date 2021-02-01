const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName =  process.env.DB_NAME;
const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});


async function makeDb () {
  console.log("entered")
    if (!client.isConnected()) {
      await client.connect()
    }
    return client.db(dbName)
}


module.exports = {
  makeDb: makeDb,
}