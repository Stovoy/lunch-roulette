import React from 'react';

export var API = {
    loginWithSlack: function (code, done) {
        $.ajax({
            url: '/api/login/slack',
            type: 'POST',
            data: {
                code: code
            },
            success: function (data) {
                done(data);
            },
            error: handleError(done)
        });
    },

    logout: function (done) {
        $.ajax({
            url: '/api/logout',
            type: 'POST',
            success: function (data) {
                done(data);
            },
            error: handleError(done)
        });
    },

    user: function (done) {
        $.ajax({
            url: '/api/user',
            type: 'GET',
            success: function (data) {
                data = JSON.parse(data);
                if (handleAuthError(data, done)) return;
                done(data);
            },
            error: handleError(done)
        });
    }
};

export var ErrorType = {
    Auth: 0,
    HTTP: 1
};

function handleError(done) {
    return function (data, _, error) {
        done({
            error: {
                type: ErrorType.HTTP,
                code: data.status,
                message: error,
                details: data.responseText
            }
        });
    }
}

function handleAuthError(data, done) {
    if (data.authError) {
        done({
            error: {
                type: ErrorType.Auth,
                message: data.authError
            }
        });
    }
    return !!data.authError;
}
