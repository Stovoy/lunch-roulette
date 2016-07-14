import React from 'react';

import AppBar from 'material-ui/AppBar';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import Divider from 'material-ui/Divider';

import { API, ErrorType } from '../api';
import { deleteCookie } from './auth';
import { Map } from './map';
import { hasError, notAnAdmin, Error } from './error';

export var App = React.createClass({
    getInitialState() {
        return {}
    },
    componentDidMount() {
        this.getUser();
    },
    render() {
        var content = null;
        var snackBar = null;
        if (this.state.error) {
            if (notAnAdmin(this.state)) {
                snackBar = (
                    <Snackbar open={true}
                              message={this.state.error.message}
                              autoHideDuration={2000}
                              onRequestClose={this.handleRequestClose}/>
                );
            } else {
                content = (
                    <Error error={this.state.error}/>
                );
            }
        }
        if (content == null) {
            if (this.state.admin) {
                content = (<Admin back={this.getUser} data={this.state.admin}/>);
            } else if (this.state.user) {
                content = (<User user={this.state.user}/>);
            }
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
                                  admin={this.administrate}
                                  logout={this.logout}/>
                <div className="loading-bar">
                    {loading}
                </div>
                {content}
                {snackBar}
            </div>
        )
    },
    getUser() {
        this.loadingWrapper(function (done) {
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
    administrate() {
        this.loadingWrapper(function (done) {
           API.admin(function (data) {
               if (hasError(data)) {
                   this.setState({error: data.error});
               } else {
                   this.setState({admin: data});
               }
               done();
           }.bind(this));
        }.bind(this));
    },
    logout() {
        this.loadingWrapper(function (done) {
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

        call(function () {
            if (timerRunning) {
                clearTimeout(showLoadingBar);
            } else {
                this.setState({loading: false});
            }
        }.bind(this));
    }
});

/*
 margin: 7px 0px 0px;
 color: rgb(255, 255, 255);
 */
var LunchRouletteBar = React.createClass({
    render() {
        var content = null;
        if (this.props.user) {
            var buttonStyle = {margin: '7px 0px 0px', color: 'rgb(255, 255, 255)'};
            var adminButton = (
                <FlatButton label='Admin'
                            onClick={this.props.admin}
                            style={buttonStyle}/>
            );
            var logoutButton = (
                <FlatButton label='Logout'
                            onClick={this.props.logout}
                            style={buttonStyle}/>
            );
            var buttonDivStyle = {marginTop: '8px', marginRight: '-16px', marginLeft: 'auto'};
            if (this.props.user.is_admin) {
                content = (
                    <AppBar title={this.props.title}>
                        <div style={buttonDivStyle}>
                            {adminButton}
                            {logoutButton}
                        </div>
                    </AppBar>
                );
            } else {
                content = (
                    <AppBar title={this.props.title}>
                        <div style={buttonDivStyle}>
                            {logoutButton}
                        </div>
                    </AppBar>
                );
            }
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
                <br/>
                <Map/>
            </div>
        )
    }
});

var Admin = React.createClass({
    render() {
        var users = this.props.data.users;
        return (
            <div>
                <br/>
                {users.map(function(user, i) {
                    return (
                        <div>
                            <span key={i}>{user.email}</span>
                            <Divider/>
                        </div>
                    )
                })}
                <RaisedButton label='Back'
                              onClick={this.props.back}/>
            </div>
        )
    }
});
