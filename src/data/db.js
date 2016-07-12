var pg = require('pg');

var config = {
    user: 'lunchroulette',
    password: 'lunchroulette',
    database: 'lunchroulette',
    max: 100,
    idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

pool.on('error', function (err, client) {
    // Rare case of a DB side issue, should log it.
    console.error('Idle client error: ', err.message, err.stack)
});

module.exports = {
    query: function (query, values, callback) {
        var handleConnection = function (err, client, done) {
            if (err) {
                return console.error('Error fetching client from pool: ', err);
            }

            var handleResult = function (err, result) {
                done();

                if (err) {
                    return console.error('Error running query: ', err);
                }
                callback(result);
            };

            if (typeof values === 'function') {
                callback = values;
                client.query(query, handleResult);
            } else {
                client.query(query, values, handleResult);
            }
        };

        pool.connect(handleConnection);
    }
};
