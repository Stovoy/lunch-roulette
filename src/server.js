var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());

var urls = require('./urls');

var port = 8080;

exports.start = function() {
    var endpoints = urls.createEndpoints();
    urls.registerEndpoints(app, endpoints);
    app.listen(port, function () {
        console.log('Listening on ' + port);
    });
};
