var getPixels = require('get-pixels');

var db = require('./db');

var MAP_PATH = 'resources/map/';
var MAP_MASK_FILE = MAP_PATH + 'map-mask.png';

var processed = {
    open: {},
    walking: {},
    boundary: {},
    width: 0,
    height: 0
};

function addCoord(obj, x, y) {
    if (x in obj) {
        obj[x][y] = true;
    } else {
        obj[x] = {y: true};
    }
}

function processPixels(pixels, width, height, onError) {
    var hasUnknowns = false;
    var open = {};
    var walking = {};
    var boundary = {};
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var r = pixels.get(x, y, 0);
            var g = pixels.get(x, y, 1);
            var b = pixels.get(x, y, 2);
            var a = pixels.get(x, y, 3);
            if (testWhite(r, g, b, a)) {
                addCoord(open, x, y);
            } else if (testGray(r, g, b, a)) {
                addCoord(walking, x, y);
            } else if (testBlack(r, g, b, a)) {
                addCoord(boundary, x, y);
            } else {
                console.log('Unknown color: ' + r + ',' + g + ',' + b + ',' + a);
                hasUnknowns = true;
            }
        }
    }
    if (hasUnknowns) {
        onError();
    } else {
        processed.open = open;
        processed.walking = walking;
        processed.boundary = boundary;
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
        console.log('Reading map-mask file');
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
        if (!this.isPointOpen(x, y)) {
            done('Invalid location.');
            return;
        }
        db.query(
            'UPDATE USER_PROFILE ' +
            'SET x = $1::integer, y = $2::integer ' +
            'WHERE id = $3::integer',
            [x, y, userId],
            function() {
                done(null);
            });
    },

    isPointOpen(x, y) {
        var open = processed.open;
        if (x in open && y in open[x]) {
            return true;
        }
    }
};
