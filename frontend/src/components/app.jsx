import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import { API, ErrorType } from '../api';
import { deleteCookie } from './auth';
import { Map } from './map';
import { Error, hasError, notAnAdmin } from './error';

var teamName = process.env.TEAM_NAME;

export var App = React.createClass({
    getInitialState() {
        return {}
    },
    componentDidMount() {
        this.getGeneral();
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
                content = (<Admin back={this.getGeneral} data={this.state.admin}/>);
            } else if (this.state.general) {
                content = (<General move={this.move} {...this.state.general}/>);
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
                <LunchRouletteBar title={teamName + ' Lunch Roulette'}
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
    getGeneral() {
        this.loadingWrapper(function (done) {
            API.general(function (data) {
                if (hasError(data)) {
                    this.replaceState({error: data.error});
                } else {
                    this.replaceState({general: data, user: data.user});
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
    move(x, y, okMove) {
        this.loadingWrapper(function (done) {
            API.move(x, y, function (data) {
                if (hasError(data)) {
                    this.setState({error: data.error});
                } else {
                    okMove();
                }
                done();
            }.bind(this));
        }.bind(this))
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

export var AppWrapper = React.createClass({
    render() {
        return (
            <MuiThemeProvider>
                <App/>
            </MuiThemeProvider>
        )
    }
});

var LunchRouletteBar = React.createClass({
    render() {
        var content = null;
        if (this.props.user) {
            var buttonStyle = {color: 'rgb(255, 255, 255)', float: 'left', marginTop: '16px'};
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
            var avatarIcon = null;
            if (this.props.user.avatar) {
                avatarIcon = (
                    <Avatar src={this.props.user.avatar}
                            size={48}
                            style={{float: 'left', marginTop: '8px'}}/>
                );
            }
            var buttonDivStyle = {
                marginRight: '-16px',
                height: '64px'
            };
            if (this.props.user.is_admin) {
                content = (
                    <div style={buttonDivStyle}>
                        {avatarIcon}
                        {adminButton}
                        {logoutButton}
                    </div>
                );
            } else {
                content = (
                    <div style={buttonDivStyle}>
                        {avatarIcon}
                        {logoutButton}
                    </div>
                );
            }
        }
        return (
            <div>
                <AppBar title={this.props.title}
                        iconElementLeft={
                            <img src="/images/logo.png"
                                 style={{
                                    height: '48px'
                                 }}/>
                        }
                        iconStyleLeft={{
                            height: 0
                        }}
                        className="unselectable">
                    {content}
                </AppBar>
            </div>
        )
    }
});

var General = React.createClass({
    getInitialState() {
        return {};
    },

    render() {
        var user = this.props.user;
        var firstName = user.name.split(' ')[0];
        var text = null;
        if (user.x == -1 || user.y == -1) {
            text = (
                <div className="center-text">
                    Welcome to Lunch Roulette, {firstName}! Please select where you work in the office.
                </div>
            )
        } else {
            text = (
                <div className="center-text">
                    Hi {firstName}. Feel free to edit where you work in the office.
                </div>
            )
        }
        var selected = this.state.selected;
        var selectedUserInfo = <div className="empty-padding right"/>;
        if (selected) {
            var avatar = null;
            if (selected.avatar) {
                avatar = (
                    <Avatar src={selected.avatar}
                            size={36}
                            style={{
                                position: 'absolute',
                                top: '6px',
                                left: '4px',
                                border: '1px solid black'
                            }}/>
                );
            }
            selectedUserInfo = (
                <div className="user-info">
                    {avatar}
                    <div className="center-text truncate"
                         style={{
                             marginTop: '15px'
                         }}>
                        {selected.name}
                    </div>
                </div>
            );
        }
        return (
            <div className="padded-div">
                {text}
                <div className="centered-container">
                    <div className="empty-padding left"/>
                    <Map {...this.props.map}
                         user={this.props.user}
                         otherUsers={this.props.otherUsers}
                         teamName={teamName}
                         move={this.props.move}
                         selectUser={this.selectUser}
                         deselectUser={this.deselectUser}/>
                    {selectedUserInfo}
                </div>
            </div>
        )
    },

    selectUser(user) {
        this.setState({selected: user});
    },

    deselectUser() {
        this.setState({selected: null});
    }
});

var Admin = React.createClass({
    render() {
        var users = this.props.data.users;
        return (
            <div>
                <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>ID</TableHeaderColumn>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Email</TableHeaderColumn>
                            <TableHeaderColumn>Admin</TableHeaderColumn>
                            <TableHeaderColumn>X</TableHeaderColumn>
                            <TableHeaderColumn>Y</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {users.map(function (user, i) {
                            if (user.x == -1 || user.y == -1) {
                                user.x = 'Not set';
                                user.y = 'Not set';
                            }
                            if (user.is_admin) {
                                user.admin = 'true';
                            } else {
                                user.admin = 'false';
                            }
                            return (
                                <TableRow key={i}>
                                    <TableRowColumn>{user.id}</TableRowColumn>
                                    <TableRowColumn>{user.name}</TableRowColumn>
                                    <TableRowColumn>{user.email}</TableRowColumn>
                                    <TableRowColumn>{user.admin}</TableRowColumn>
                                    <TableRowColumn>{user.x}</TableRowColumn>
                                    <TableRowColumn>{user.y}</TableRowColumn>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <RaisedButton label='Back'
                              onClick={this.props.back}
                              style={{marginTop: '10px'}}/>
            </div>
        )
    }
});
