// How to use cookies in spider of scrapy - PYTHON

// import os
// if os.stat("cookie.json").st_size > 2:
//     with open('./cookie.json', 'r') as inputfile:
//         self.cookie = json.load(inputfile)
//     inputfile.close()


var zeromq = require("zeromq");

var socket = zeromq.createSocket('rep');

socket.bind("tcp://127.0.0.1:5502",
            function(err)
            {
                if (err) throw err;
                console.log("Bound to port 5502.");

                socket.on('message', function(envelope, blank, data)
                          {
                              console.log(envelope.toString('utf8'));
                              socket.send(envelope.toString('utf8') + " Blancmange!");
                          });

                socket.on('error', function(err) {
                    console.log("Error: "+err);
                });
            }
);