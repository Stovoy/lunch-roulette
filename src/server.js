var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var urls = require('./urls');

var port = 8000;

exports.start = function() {
    var endpoints = urls.createEndpoints();
    urls.registerEndpoints(app, endpoints);
    app.listen(port, function () {
        console.log('Listening on ' + port);
    });
};
