import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import Divider from 'material-ui/Divider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


import { Grid, Row, Col } from 'react-flexbox-grid';

import { API, ErrorType } from '../api';
import { deleteCookie } from './auth';
import { Map } from './map';
import { Error, hasError, notAnAdmin } from './error';

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
                    <div style={buttonDivStyle}>
                        {adminButton}
                        {logoutButton}
                    </div>
                );
            } else {
                content = (
                    <div style={buttonDivStyle}>
                        {logoutButton}
                    </div>
                );
            }
        }
        return (
            <div>
                <AppBar title={this.props.title}
                        showMenuIconButton={false}>
                    {content}
                </AppBar>
            </div>
        )
    }
});

var General = React.createClass({
    render() {
        var user = this.props.user;
        var firstName = user.name.split(' ')[0];
        var text = null;
        if (user.x == -1 || user.y == -1) {
            text = (
                <div>
                    Welcome to Lunch Roulette, {firstName}! Please select where you work on the map.
                </div>
            )
        } else {
            text = (
                <span>
                    Hi {firstName}. Feel free to edit where you are on the map.
                </span>
            )
        }
        return (
            <div>
                <br/>
                <Row>
                    <Col>
                        {text}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Map {...this.props.map}
                            move={this.props.move}
                            user={this.props.user}
                            otherUsers={this.props.otherUsers}/>
                    </Col>
                </Row>
            </div>
        )
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
