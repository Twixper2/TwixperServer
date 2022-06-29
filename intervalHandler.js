const participantsService_selenium = require("./service/participants/participantsService_selenium.js")

async function main(){
    try{
        console.log("starting notifications check")
        let test = await setInterval( async () => { await participantsService_selenium.checkForPushNotifications()}, 30000);
        console.log("fines notifications check")
        
        // await participantsService_selenium.checkForPushNotifications()
    }catch(e){
        console.log(e);
    }
}
main()
