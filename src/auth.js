module.exports = {
    validate: function(req, res) {
        var valid = true;
        var error = '';
        var sessionID = req.cookies.SessionID;
        if (sessionID == null) {
            valid = false;
            error = 'SessionID is not set';
        }
        if (!valid) {
            res.send(JSON.stringify({authError: error}));
        }
        return valid;
    }
};
