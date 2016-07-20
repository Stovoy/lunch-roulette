var map = require('./data/map');
var server = require('./server');

map.process(function() {
    console.log('An error occured with map processing, exiting.');
    process.exit(1);
});

server.start();
