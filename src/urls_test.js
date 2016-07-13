var assert = require('assert');
var fs = require('fs');

var urls = require('../src/urls');

describe('urls.js', function() {
    var endpoints = urls.createEndpoints();

    describe('createEndpoints', function() {
        it('should create the expected endpoints', function() {
            // Basic check that endpoints exist.
            assert('fetchUser' in endpoints.get);
            assert('adminInfo' in endpoints.get);
            assert.equal(Object.keys(endpoints.get).length, 2);

            assert('loginWithSlack' in endpoints.post);
            assert('logoutUser' in endpoints.post);
            assert.equal(Object.keys(endpoints.post).length, 2);
        });
    });

    describe('registerEndpoints', function() {
        var app = {
            // Testable mock
            get: function(path, handler) {
                this.paths.get.add(path);
            },
            post: function(path, handler) {
                this.paths.post.add(path);
            },
            paths: {
                get: new Set(),
                post: new Set()
            }
        };
        var endpoints = {
            get: {
                'a': {
                    path: 'a',
                    handler: function() {}
                },
                'b': {
                    path: 'b',
                    handler: function() {}
                }
            },
            post: {
                'c': {
                    path: 'c',
                    handler: function() {}
                }
            }
        };
        it('should register given endpoints', function() {
            urls.registerEndpoints(app, endpoints);
            assert(app.paths.get.has('a'));
            assert(app.paths.get.has('b'));
            assert.equal(app.paths.get.size, 2);
            assert(app.paths.post.has('c'));
            assert.equal(app.paths.post.size, 1);
        });
    });

    describe('endpoint: feed', function () {
        // Handle auth test cases
        // auth middleware?
        it('should serve the feed json', function (done) {
            done();
        });
    });
});
