import React from 'react';

import { ErrorType } from '../api';
import { Login, deleteCookie } from './auth';

export function hasError(data) {
    return !!data.error;
}

export function notAnAdmin(data) {
    return data.error && data.error.type == ErrorType.Auth && data.error.message == 'Not an admin';
}

export var Error = React.createClass({
    render() {
        var type = this.props.error.type;
        if (type == ErrorType.Auth) {
            if (this.props.error.message == 'Invalid session') {
                deleteCookie();
            }
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
