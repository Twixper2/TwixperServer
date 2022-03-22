var zeromq = require("zeromq");
var socket = zeromq.createSocket('rep');

async function dataTransformationToScrape(port,selenium_cookies){
    if( selenium_cookies != undefined){
        socket.bind("tcp://127.0.0.1:"+port,
        function(err)
        {
            if (err) throw err;
            console.log("Bound to port "+port+".");

            socket.on('message', function(envelope, blank, data)
                      {
                        console.log(envelope.toString('utf8'));
                        console.log("before send cookies");
                        console.log(selenium_cookies);
                        socket.send(envelope.toString('utf8') + selenium_cookies);
                        // socket.send(envelope.toString('utf8') + " Blancmange!");
                      });

            socket.on('error', function(err) {
                console.log("Error: "+err);
            });
        }
        );
    }  
}

module.exports = {dataTransformationToScrape : dataTransformationToScrape};