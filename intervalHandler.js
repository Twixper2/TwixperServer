const participantsService_selenium = require("./service/participants/participantsService_selenium.js")

async function main(){
    try{
        console.log("starting notifications check")
        let test = await setInterval( async () => { await participantsService_selenium.checkForPushNotifications()}, 500000);
        
    }catch(e){
        console.log(e);

    }
}
main()
