import React from 'react';
import cookie from 'react-cookie';
import { withRouter } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';

import { API } from '../api'

var slackClientID = process.env.SLACK_CLIENT_ID;
var slackTeam = process.env.SLACK_TEAM;

var AUTH_COOKIE = 'lunch-roulette-auth';

export var Login = React.createClass({
    getInitialState() {
        return {
            slack_url: getSlackOAuthURL()
        };
    },
    render() {
        return (
            <div className="login-container">
                <p>
                    Hi! Please sign in to Lunch Roulette.
                </p>
                <RaisedButton
                    label="Login with Slack"
                    className="login-button"
                    icon={
                        <img src="/images/slack.png"/>
                    }
                    href={this.state.slack_url}/>
            </div>
        )
    }
});


export var LoginDone = withRouter(
    React.createClass({
        componentDidMount() {
            var auth = getQueryData();
            var code = auth.code;
            API.loginWithSlack(code, function(data) {
                data = JSON.parse(data);
                cookie.save(AUTH_COOKIE, data.session, { path: '/' });
                this.props.router.replace('/');
            }.bind(this));
        },
        render() {
            return (
                <div>
                </div>
            );
        }
    })
);

export function deleteCookie () {
  cookie.remove(AUTH_COOKIE, { path : '/' });
}

function getSlackOAuthURL() {
    var url = 'https://slack.com/oauth/authorize?';
    url += encodeQueryData({
        client_id: slackClientID,
        redirect_url: window.location.host + '/login',
        team: slackTeam,
        scope: 'identity.basic identity.email'
    });
    return url;
}

function encodeQueryData(data) {
    var query = [];
    for (var d in data) {
        query.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
    }
    return query.join("&");
}

function getQueryData() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        }
    );
    return vars;
}
