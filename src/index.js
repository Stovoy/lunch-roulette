var map = require('./map');
var server = require('./server');

map.process(function(open, walking, boundary) {
    if (open == null) {
        console.log('An error occured with map processing, exiting.');
        process.exit(1);
    }
});

server.start();
