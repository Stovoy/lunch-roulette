var assert = require('assert');
var fs = require('fs');

var urls = require('../src/urls');

describe('urls.js', function() {
    var endpoints = urls.createEndpoints();

    describe('createEndpoints', function() {
        it('should create the expected endpoints', function() {
            // Basic check that endpoints exist.
            assert('index' in endpoints.get);
            assert('static' in endpoints.get);
            assert.equal(Object.keys(endpoints.get).length, 2);

            assert.equal(Object.keys(endpoints.post).length, 0);
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
        }
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
        }
        it('should register given endpoints', function() {
            urls.registerEndpoints(app, endpoints);
            assert(app.paths.get.has('a'));
            assert(app.paths.get.has('b'));
            assert.equal(app.paths.get.size, 2);
            assert(app.paths.post.has('c'));
            assert.equal(app.paths.post.size, 1);
        });
    })

    describe('endpoint: index', function () {
        it('should serve the index.html page', function (done) {
            var res = {
                sendFile: function(path) {
                    this.sentPath = path;
                },
                sentPath: null
            };
            endpoints.get['index'].handler(null, res);
            assert(res.sentPath.endsWith('index.html'));
            fs.readFile(res.sentPath, 'utf8', function (err, data) {
                if (err) {
                    assert.fail(err);
                }
                done();
            });
        });
    });

    describe('endpoint: static', function () {
        it('should serve the favicon', function (done) {
            var res = {
                sendFile: function(path) {
                    this.sentPath = path;
                },
                sentPath: null
            };
            var req = {
                params: ['/favicon.ico']
            }
            endpoints.get['static'].handler(req, res);
            assert(res.sentPath.endsWith('favicon.ico'));
            fs.readFile(res.sentPath, 'utf8', function (err, data) {
                if (err) {
                    assert.fail(err);
                }
                done();
            });
        });
    });
});
