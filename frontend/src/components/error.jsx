import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import { ErrorType } from '../api';
import { Login, deleteCookie } from './auth';

export function hasError(data) {
    return !!data.error;
}

export var Error = React.createClass({
    render() {
        var type = this.props.error.type;
        if (type == ErrorType.Auth) {
            if (this.props.error.message == 'Invalid session') {
                deleteCookie();
            }
            var snackBar = (
                <Snackbar
                    open={true}
                    message={'Unauthorized: ' + this.props.error.message}
                    autoHideDuration={2000}
                    onRequestClose={this.handleRequestClose}/>
            );
            // Use the snackbar? Don't want it after logout or on first load.
            return (
                <div>
                    <Login/>
                </div>
            );
        }
        if (type == ErrorType.HTTP) {
            var message = '';
            if (this.props.code) {
                if (this.props.message) {
                    message = this.props.code + '-' + this.props.message;
                } else {
                    message = this.props.code;
                }
            } else if (this.props.message) {
                message = this.props.message;
            }
            return (
                <div className="error">
                    <h1>{message}</h1>
                    <h2>There was an error communicating with the server.</h2>
                    <p>
                        <i>{this.props.details}</i>
                    </p>
                </div>
            );
        }
    }
});
