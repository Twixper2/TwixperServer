// import { v4 as uuidv4 } from 'uuid';
var uuidLib = require('uuid')

function generateUUID() {
    let uuid = uuidLib.v4(); // random uuid 
    return uuid
}

module.exports = {
    generateUUID : generateUUID
}
