var getPixels = require('get-pixels');

var MAP_PATH = 'resources/map/';
var MAP_FILE = MAP_PATH + 'map.png';
var MAP_MASK_FILE = MAP_PATH + 'map-mask.png';

function testBlack(r, g, b, a) {
    return r == 0 && g == 0 && b == 0 && a == 255;
}
function testWhite(r, g, b, a) {
    return r == 255 && g == 255 && b == 255 && a == 255;
}
function testGray(r, g, b, a) {
    return r == 205 && g == 205 && b == 205 && a == 255;
}

function addCoord(obj, x, y) {
    if (x in obj) {
        obj[x].push(y);
    } else {
        obj[x] = [y];
    }
}

function processPixels(pixels, width, height, done) {
    var open = {};
    var walking = {};
    var boundary = {};
    var hasUnknowns = false;
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
        done(null);
    } else {
        done(open, walking, boundary);
    }
}

module.exports = {
    process: function (done) {
        console.log('Reading map file');
        getPixels(MAP_FILE, function (err, pixels) {
            if (err) {
                console.log(err);
                done(null);
                return;
            }
            var width = pixels.shape[0];
            var height = pixels.shape[1];
            var channels = pixels.shape[2];
            if (channels != 4) {
                console.log('Must have four color channels (r, g, b, a).');
                done(null);
                return;
            }
            console.log('Reading map-mask file');
            getPixels(MAP_MASK_FILE, function (err, pixels) {
                if (err) {
                    console.log(err);
                    done(null);
                } else if (width != pixels.shape[0]) {
                    console.log('Width of map and map-mask are not equal.');
                    done(null);
                } else if (height != pixels.shape[1]) {
                    console.log('height of map and map-mask are not equal.');
                    done(null);
                } else if (channels != pixels.shape[2]) {
                    console.log('Number of color channels for map and map-mask are not equal.');
                    done(null);
                } else {
                    processPixels(pixels, width, height, done);
                }
            });
        });
    }
};
