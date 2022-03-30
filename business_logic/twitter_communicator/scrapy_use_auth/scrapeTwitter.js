const { json } = require("express");
var zeromq = require("zeromq");
var socket = zeromq.createSocket('rep');

async function dataTransformationToScrape(port,selenium_cookies){
    if(selenium_cookies != undefined){
        socket.bind("tcp://127.0.0.1:"+port,
        function(err)
        {
            if (err) throw err;
            console.log("Bound to port "+port+".");

            socket.on('message', function(envelope, blank, data)
                      {
                        // envelope.toString('utf8') => the message received from the other side
                        // console.log();
                        // console.log(selenium_cookies);
                        var cookies_parsed = JSON.stringify(selenium_cookies);
                        // socket.send(envelope.toString('utf8') + cookies_parsed);
                        socket.send(cookies_parsed);
                      });

            socket.on('error', function(err) {
                console.log("Error: "+err);
            });
        }
        );
    }  
}



module.exports = {dataTransformationToScrape : dataTransformationToScrape};