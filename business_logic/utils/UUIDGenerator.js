import { v4 as uuidv4 } from 'uuid';

function generateUUID() {
    let uuid = uuidv4(); // random uuid 
    return uuid
}

module.exports = {
    generateUUID : generateUUID
}