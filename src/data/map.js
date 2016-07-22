var getPixels = require('get-pixels');

var db = require('./db');
var user = require('./user');

var MAP_PATH = 'resources/map/';
var MAP_MASK_FILE = MAP_PATH + 'map-mask.png';

var processed = {
    points: null,
    width: 0,
    height: 0
};

var State = {
    Open: 0,
    Walking: 1,
    Boundary: 2
};

function setCoord(points, x, y, state) {
    points[x][y] = state;
}

function processPixels(pixels, width, height, onError) {
    var hasUnknowns = false;
    var points = new Array(width);
    for (var i = 0; i < width; i++) {
        points[i] = new Array(height);
    }
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var r = pixels.get(x, y, 0);
            var g = pixels.get(x, y, 1);
            var b = pixels.get(x, y, 2);
            var a = pixels.get(x, y, 3);
            if (testWhite(r, g, b, a)) {
                setCoord(points, x, y, State.Open);
            } else if (testGray(r, g, b, a)) {
                setCoord(points, x, y, State.Walking);
            } else if (testBlack(r, g, b, a)) {
                setCoord(points, x, y, State.Boundary);
            } else {
                console.log('Unknown color: ' + r + ',' + g + ',' + b + ',' + a);
                hasUnknowns = true;
            }
        }
    }
    if (hasUnknowns) {
        onError();
    } else {
        processed.points = points;
        processed.width = width;
        processed.height = height;
    }
}

function testBlack(r, g, b, a) {
    return r == 0 && g == 0 && b == 0 && a == 255;
}
function testWhite(r, g, b, a) {
    return r == 255 && g == 255 && b == 255 && a == 255;
}
function testGray(r, g, b, a) {
    return r == 205 && g == 205 && b == 205 && a == 255;
}

module.exports = {
    process: function (onError) {
        getPixels(MAP_MASK_FILE, function (err, pixels) {
            var width = pixels.shape[0];
            var height = pixels.shape[1];
            var channels = pixels.shape[2];
            if (err) {
                console.log(err);
                onError();
            } else if (channels != 4) {
                console.log('Must have four color channels (r, g, b, a).');
                onError();
            } else {
                processPixels(pixels, width, height, onError);
            }
        });
    },

    get: function() {
        return processed;
    },

    moveUser: function(userId, x, y, done) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        if (!this.isPointOpen(x, y)) {
            done('Invalid location.');
            return;
        }
        this.queryOccupyingUser(userId, x, y, function(occupyingUser) {
            if (occupyingUser != null) {
                done('Invalid location.');
            }
            db.query(
                'UPDATE USER_PROFILE ' +
                'SET x = $1::integer, y = $2::integer ' +
                'WHERE id = $3::integer',
                [x, y, userId],
                function() {
                    done(null);
                });
        });
    },

    isPointOpen(x, y) {
        return processed.points[x][y] == State.Open;
    },

    queryOccupyingUser(userId, x, y, done) {
        user.getOtherUsers(userId, function(users) {
            var minDistance = 4;
            var occupyingUsers = [];
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (Math.abs(x - user.x) < minDistance &&
                    Math.abs(y - user.y) < minDistance) {
                    occupyingUsers.push(user);
                }
            }
            var nearestUser = null;
            var nearestDistance = Number.MAX_VALUE;
            for (var i = 0; i < occupyingUsers.length; i++) {
                var user = occupyingUsers[i];
                var dX = user.x - x;
                var dY = user.y - y;
                var d = Math.sqrt(dX * dX + dY * dY);
                if (d < nearestDistance) {
                    nearestDistance = d;
                    nearestUser = user;
                }
            }
            done(nearestUser);
        });
    }
};
