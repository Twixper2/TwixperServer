const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName =  process.env.DB_NAME;
const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});


async function makeDb () {
    if (!client.isConnected()) {
      await client.connect()
    }
    return client.db(dbName)
}


module.exports = {
  makeDb: makeDb,
}