import React from 'react';
import { Link } from 'react-router';

import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';


import { API } from '../api'

export var App = React.createClass({
    getInitialState() {
        return {}
    },
    componentDidMount() {
        setTimeout(function() {
            if (Object.keys(this.state) == 0) {
                this.setState({loading: true});
            }
        }.bind(this), 100);
        API.feed(function (data) {
            if (data.error) {
                if (data.error.authError) {
                    this.replaceState({unauth: data.error.authError});
                } else {
                    this.replaceState({error: data.error});
                }
            } else {
                this.replaceState({feed: data});
            }
        }.bind(this));
    },
    render() {
        var content;
        if (this.state.error) {
            content = (
                <Error code={this.state.error.code}
                       title={this.state.error.title}
                       details={this.state.error.details}/>
            );
        } else if (this.state.loading) {
            content = (<Loading/>);
        } else if (this.state.unauth) {
            content = (
                <div>
                    <Login/>
                    <Snackbar
                      open={true}
                      message={'Unauthorized: ' + this.state.unauth}
                      autoHideDuration={2000}
                      onRequestClose={this.handleRequestClose}/>
                </div>
            );
        } else if (this.state.feed) {
            content = (<Feed/>);
        }
        return (
            <div>
                <AppBar
                    title="Lunch Roulette"/>
                {content}
            </div>
        )
    }
});

var Feed = React.createClass({
    render() {
        return (
            <div>

            </div>
        )
    }
});

var Error = React.createClass({
    render() {
        return (
            <div className="error">
                <h1>{this.props.code} - {this.props.title}</h1>
                <h2>There was an error communicating with the server.</h2>
                <p>
                    <i>{this.props.details}</i>
                </p>
            </div>
        )
    }
});

var Loading = React.createClass({
    render() {
        return (
            <div>
                <div className="loading-container">
                    <p>Loading lunch roulette...</p>
                    <CircularProgress/>
                </div>
            </div>
        )
    }
});

var Login = React.createClass({
    render() {
        return (
            <div className="login-container">
                <p>
                    Hi! Please sign in to Lunch Roulette.
                </p>
                <RaisedButton
                    label="Login with Gmail"
                    className="login-button"
                    linkButton={true}
                    onMouseDown={this.loginwithGmail}
                    icon={
                        <img src="/images/gmail.png"/>
                    }/>
                <br/>
                <RaisedButton
                    label="Login with Slack"
                    className="login-button"
                    linkButton={true}
                    onMouseDown={this.loginWithSlack}
                    icon={
                        <img src="/images/slack.png"/>
                    }/>
            </div>
        )
    },
    loginwithGmail() {
        API.loginwithGmail(function (data) {
        }.bind(this));
    },
    loginWithSlack() {
        API.loginWithSlack(function (data) {
        }.bind(this));
    }
});
