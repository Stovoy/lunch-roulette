var db = require('./db');
var uuid = require('node-uuid');

function getUserByEmail(email, done) {
    db.query(
        'SELECT id ' +
        'FROM USER_PROFILE AS profile ' +
        'WHERE profile.email = $1::text',
        [email],
        function (result) {
            var rows = result.rows;
            if (rows.length == 1) {
                done(rows[0].id);
            } else {
                done(null);
            }
        });
}

function newUser(name, email, done) {
    db.query(
        'INSERT INTO USER_PROFILE (name, email, x, y) ' +
        'VALUES ($1::text, $2::text, -1, -1) ' +
        'RETURNING id',
        [name, email],
        function (result) {
            done(result.rows[0].id);
        }
    )
}

function getSessionByUserId(userId, done) {
    db.query(
        'SELECT session ' +
        'FROM USER_SESSION AS session ' +
        'WHERE session.user_id = $1::integer',
        [userId],
        function (result) {
            var rows = result.rows;
            if (rows.length == 1) {
                done(rows[0].session);
            } else {
                done(null);
            }
        });
}

function getUserIdBySession(session, done) {
    db.query(
        'SELECT user_id ' +
        'FROM USER_SESSION AS session ' +
        'WHERE session.session = $1::text',
        [session],
        function (result) {
            var rows = result.rows;
            if (rows.length == 1) {
                done(rows[0].user_id);
            } else {
                done(null);
            }
        }
    )
}

function login(userId, done) {
    var session = uuid.v4();
    db.query(
        'INSERT INTO USER_SESSION (user_id, session)' +
        'VALUES ($1::integer, $2::text)',
        [userId, session],
        function () {
           done(session);
        });

}

function logout(userId, done) {
    db.query(
        'DELETE FROM USER_SESSION AS session ' +
        'WHERE session.user_id = $1::integer',
        [userId],
        function () {
           done();
        });

}

function getOrCreateSession(name, email, done) {
    getUserByEmail(email, function (userId) {
        if (userId == null) {
            newUser(name, email, function (userId) {
                login(userId, function (session) {
                    done(session);
                });
            });
        } else {
            getSessionByUserId(userId, function(session) {
                if (session == null) {
                    login(userId, function (session) {
                        done(session);
                    });
                } else {
                    done(session);
                }
            });
        }
    });
}

function getUserById(userId, done) {
    db.query(
        'SELECT name, email, x, y ' +
        'FROM USER_PROFILE AS profile ' +
        'WHERE profile.id = $1::integer',
        [userId],
        function (result) {
            var rows = result.rows;
            if (rows.length == 1) {
                done(rows[0]);
            } else {
                done(null);
            }
        }
    );
}

module.exports = {
    getUserByEmail,
    newUser,
    getSessionByUserId,
    getUserIdBySession,
    login,
    logout,
    getOrCreateSession,
    getUserById
};
