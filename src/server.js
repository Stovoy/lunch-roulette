var express = require("express");
var app = express();

var urls = require('./urls');

var port = process.env.PORT || 80;

module.exports = {
    start: function() {
        endpoints = urls.createEndpoints();
        urls.registerEndpoints(app, endpoints);
        app.listen(port, function() {
            console.log("Listening on " + port);
        });
    }
};
