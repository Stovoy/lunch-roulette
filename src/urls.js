/**
 Sets up all app endpoints.
*/
var path = require('path');

var staticRoot = path.resolve('static') + '/';

module.exports = {
    createEndpoints: function() {
        var endpoints = {
            get: {},
            post: {}
        }
        var endpoint = function(name, method, path, handler) {
            var endpoint = {
                path: path,
                handler: handler
            }
            if (method == get) {
                endpoints.get[name] = endpoint;
            } else if (method == post) {
                endpoints.post[name] = endpoint;
            }
        }
        var get = 'get';
        var post = 'post';

        var index = endpoint('index', get, '/', function(req, res) {
            /** Serves the index page */
            res.sendFile(staticRoot + 'index.html');
        });

        var static = endpoint('static', get, /^(.+)$/, function(req, res){
            /** Serves static content */
            res.sendFile(staticRoot + req.params[0]);
        });

        return endpoints;
    },
    registerEndpoints: function(app, endpoints) {
        for (var name in endpoints.get) {
            var endpoint = endpoints.get[name];
            app.get(endpoint.path, endpoint.handler);
        }
        for (var name in endpoints.post) {
            var endpoint = endpoints.post[name];
            app.post(endpoint.path, endpoint.handler);
        }
    }
};
