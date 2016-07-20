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
                if (data.length > 0) {
                    data = JSON.parse(data);
                    if (handleServerError(data, done)) return;
                }
                done(data);
            },
            error: handleError(done)
        });
    },

    general: function (done) {
        $.ajax({
            url: '/api/general',
            type: 'GET',
            success: function (data) {
                data = JSON.parse(data);
                if (handleServerError(data, done)) return;
                done(data);
            },
            error: handleError(done)
        });
    },

    admin: function (done) {
        $.ajax({
            url: '/api/admin',
            type: 'GET',
            success: function (data) {
                data = JSON.parse(data);
                if (handleServerError(data, done)) return;
                done(data);
            },
            error: handleError(done)
        });
    },

    move: function (x, y, done) {
        $.ajax({
            url: '/api/move',
            data: {x: x, y: y},
            type: 'POST',
            success: function (data) {
                if (data.length > 0) {
                    data = JSON.parse(data);
                    if (handleServerError(data, done)) return;
                }
                done(data);
            },
            error: handleError(done)
        });
    }
};

export var ErrorType = {
    Auth: 0,
    HTTP: 1,
    Server: 2
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

function handleServerError(data, done) {
    var error = false;
    if (data.authError) {
        done({
            error: {
                type: ErrorType.Auth,
                message: data.authError
            }
        });
    } else if (data.serverError) {
        done({
            error: {
                type: ErrorType.Server,
                message: data.serverError
            }
        });
    }
    return error;
}
