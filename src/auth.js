var ajax = require('djax').default;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var user = require('./data/user');

var slack_client_id = process.env.SLACK_CLIENT_ID;
var slack_client_secret = process.env.SLACK_CLIENT_SECRET;

module.exports = {
    getUserId: function (req, res, done) {
        var error = '';
        var session = req.cookies['lunch-roulette-auth'];
        if (session == null) {
            error = 'Session is not set';
        } else {
            user.getUserIdBySession(session, function (userId) {
                if (userId == null) {
                    error = 'Invalid session';
                    res.send(JSON.stringify({authError: error}));
                    done(null);
                } else {
                    done(userId);
                }
            });
        }
        if (error != '') {
            res.send(JSON.stringify({authError: error}));
            done(null);
        }
    },

    slackAuth: function (code, res) {
        ajax({
            url: 'https://slack.com/api/oauth.access',
            type: 'POST',
            data: {
                client_id: slack_client_id,
                client_secret: slack_client_secret,
                code: code
            },
            success: function (data) {
                if (data && data.user && data.user.name && data.user.email) {
                    var user = data.user;

                    var avatar = null;
                    if (user.image_512) {
                        avatar = user.image_512;
                    } else if (user.image_192) {
                        avatar = user.image_192;
                    } else if (user.image_72) {
                        avatar = user.image_72;
                    } else if (user.image_48) {
                        avatar = user.image_48;
                    }

                    user.getOrCreateSession(
                        user.name,
                        user.email,
                        function (userId, session) {
                            res.send(JSON.stringify({session: session}));
                            user.saveAvatar(userId, avatar);
                        });
                } else {
                    res.send(JSON.stringify(data))
                }
            },
            error: function (data) {
                res.send(JSON.stringify({error: data}));
            },
            xhr() {
                return new XMLHttpRequest();
            }
        });
    }
};
