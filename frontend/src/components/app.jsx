import React from 'react';
import { Link } from 'react-router';

import AppBar from 'material-ui/AppBar';
import LinearProgress from 'material-ui/LinearProgress';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { API, ErrorType } from '../api';
import { deleteCookie } from './auth';
import { hasError, Error } from './error';

export var App = React.createClass({
    getInitialState() {
        return {}
    },
    componentDidMount() {
        this.getUser();
    },
    render() {
        var content;
        if (this.state.error) {
            content = (
                <Error error={this.state.error}/>
            );
        } else if (this.state.user) {
            content = (<User user={this.state.user}/>);
        }
        var loading;
        if (this.state.loading) {
            loading = (
                <LinearProgress
                    mode="indeterminate"
                    style={{height: '8px'}}/>
            )
        }
        return (
            <div>
                <LunchRouletteBar title="Lunch Roulette"
                                  user={this.state.user}
                                  logout={this.logout}/>
                <div className="loading-bar">
                    {loading}
                </div>
                {content}
            </div>
        )
    },
    getUser() {
        this.loadingWrapper(function(done) {
            API.user(function (data) {
                if (hasError(data)) {
                    this.replaceState({error: data.error});
                } else {
                    this.replaceState({user: data});
                }
                done();
            }.bind(this));
        }.bind(this));
    },
    logout() {
        this.loadingWrapper(function(done) {
            API.logout(function (data) {
                if (hasError(data)) {
                    this.replaceState({error: data.error});
                } else {
                    deleteCookie();
                    this.replaceState({error: {type: ErrorType.Auth}});
                }
                done();
            }.bind(this));
        }.bind(this));

    },
    loadingWrapper(call) {
        // How long to wait until showing the loading bar.
        var loadingTimeout = 250;
        var timerRunning = true;
        var showLoadingBar = setTimeout(function () {
            this.setState({loading: true});
            timerRunning = false;
        }.bind(this), loadingTimeout);

        call(function() {
            if (timerRunning) {
                clearTimeout(showLoadingBar);
            } else {
                this.setState({loading: false});
            }
        }.bind(this));
    }
});

var LunchRouletteBar = React.createClass({
    render() {
        var content = null;
        if (this.props.user) {
            content = (
                <AppBar title={this.props.title}
                        iconElementRight={
                            <FlatButton label="Logout"
                                        onClick={this.props.logout}/>
                        }/>
            );
        } else {
            content = (
                <AppBar title={this.props.title}/>
            );
        }
        return (
            <div>
                {content}
            </div>
        )
    }
});

var User = React.createClass({
    render() {
        // X: {this.props.user.x}
        // Y: {this.props.user.y}
        return (
            <div>
                <br/>
                Name: {this.props.user.name}<br/>
                Email: {this.props.user.email}<br/>
            </div>
        )
    }
});
