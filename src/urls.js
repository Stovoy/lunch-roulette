/**
 Sets up all app endpoints.
 */

var auth = require('./auth');

exports.createEndpoints = function () {
    var endpoints = {
        get: {},
        post: {}
    };
    var endpoint = function (name, method, path, handler) {
        var endpoint = {
            path: path,
            handler: handler
        };
        if (method == get) {
            endpoints.get[name] = endpoint;
        } else if (method == post) {
            endpoints.post[name] = endpoint;
        }
    };
    var get = 'get';
    var post = 'post';

    var feed = endpoint('feed', get, '/api/feed/', function(req, res) {
        /** Serves the feed */
        if (!auth.validate(req, res)) return;
        res.send(JSON.stringify({feed: true}));
    });

    var loginwithGmail = endpoint('loginGmail', post, '/api/login/gmail', function(req, res) {
        console.log('login - gmail');
        res.send(JSON.stringify({login: 'gmail'}));
    });

    var loginWithSlack = endpoint('loginSlack', post, '/api/login/slack', function(req, res) {
        console.log('login - slack');
        res.send(JSON.stringify({login: 'slack'}));
    });

    return endpoints;
};

exports.registerEndpoints = function (app, endpoints) {
    var name;
    var endpoint;
    for (name in endpoints.get) {
        endpoint = endpoints.get[name];
        app.get(endpoint.path, endpoint.handler);
    }
    for (name in endpoints.post) {
        endpoint = endpoints.post[name];
        app.post(endpoint.path, endpoint.handler);
    }
};
