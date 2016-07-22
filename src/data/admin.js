var db = require('./db');

function getAdminInfo(done) {
    // TODO: Will need to include data on the lunch roulette timing.
    db.query(
        'SELECT id, name, email, is_admin, x, y ' +
        'FROM USER_PROFILE ' +
        'ORDER BY id',
        function (result) {
            done({ users: result.rows });
        });
}

module.exports = {
    getAdminInfo
};
