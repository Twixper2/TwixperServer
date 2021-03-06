var uuidLib = require('uuid')

function generateUUID() {
    let uuid = uuidLib.v4(); // random uuid 
    return uuid
}

module.exports = {
    generateUUID : generateUUID
}