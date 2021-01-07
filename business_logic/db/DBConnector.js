import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient
const uri = "mongodb+srv://dekellevy:dekeldekel@twixper0.jo1eq.mongodb.net/Twixper()?retryWrites=true&w=majority";
const dbName =  "Twixper"
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