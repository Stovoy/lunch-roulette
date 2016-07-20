/**
 Sets up all app endpoints.
 */

var auth = require('./auth');
var admin = require('./data/admin');
var user = require('./data/user');
var map = require('./data/map');

exports.createEndpoints = function () {
    var endpoints = {
        get: {},
        post: {}
    };

    var GET = 'get';
    var POST = 'post';
    var endpoint = function (name, method, path, handler) {
        var endpoint = {
            path: path,
            handler: handler
        };
        if (method == GET) {
            endpoints.get[name] = endpoint;
        } else if (method == POST) {
            endpoints.post[name] = endpoint;
        }
    };

    var loginWithSlack = endpoint('loginWithSlack', POST, '/api/login/slack', function (req, res) {
        auth.slackAuth(req.body.code, res);
    });


    // Wrapper for endpoints that needs a valid session key.
    var authEndpoint = function (name, method, path, handler) {
        endpoint(name, method, path, function (req, res) {
            auth.getUserId(req, res, function (userId) {
                if (userId == null) return;
                handler(req, res, userId);
            });
        });
    };

    var logoutUser = authEndpoint('logoutUser', POST, '/api/logout/', function (req, res, userId) {
        /** Log out a user */
        user.logout(userId, function () {
            res.end();
        });
    });

    var fetchGeneral = authEndpoint('fetchGeneral', GET, '/api/general/', function (req, res, userId) {
        /** Fetch general info */
        user.getUserById(userId, function (userInfo) {
            var mapInfo = map.get();
            user.getOtherUsers(userId, function (otherUsers) {
                res.send(JSON.stringify({
                    map: mapInfo,
                    user: userInfo,
                    otherUsers: otherUsers
                }));
            });
        });
    });

    var moveUser = authEndpoint('moveUser', POST, '/api/move/', function (req, res, userId) {
        /* Move a user */
        map.moveUser(userId, req.body.x, req.body.y, function(error) {
            if (error == null) {
                res.end();
            } else {
                res.send(JSON.stringify({serverError: error}));
            }
        });
    });

    // Wrapper for endpoints that can only be accessed by an admin.
    var adminEndpoint = function (name, method, path, handler) {
        authEndpoint(name, method, path, function (req, res, userId) {
            user.userIsAdmin(userId, function (isAdmin) {
                if (isAdmin == true) {
                    handler(req, res, userId);
                } else {
                    res.send(JSON.stringify({authError: 'Not an admin'}));
                }
            });
        });
    };

    var fetchAdmin = adminEndpoint('fetchAdmin', GET, '/api/admin/', function (req, res, userId) {
        /** Fetch admin info */
        admin.getAdminInfo(function (adminInfo) {
            res.send(JSON.stringify(adminInfo));
        });
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
