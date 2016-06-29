import React from 'react';

export var API = {
    feed: function (done) {
        $.ajax({
            url: '/api/feed',
            type: 'GET',
            success: function (data) {
                data = JSON.parse(data);
                if (data.authError) {
                    done({
                        error: {
                            authError: data.authError
                        }
                    });
                } else {
                    done(data);
                }
            },
            error: function (data, _, error) {
                done({
                    error: {
                        code: data.status,
                        title: error,
                        details: data.responseText
                    }
                });
            }
        });
    },

    loginwithGmail: function (done) {
        $.ajax({
            url: '/api/login/gmail',
            type: 'POST',
            success: function (data) {
            },
            error: function (data, _, error) {
                done({
                    error: {
                        code: data.status,
                        title: error,
                        details: data.responseText
                    }
                });
            }
        });
    },

    loginWithSlack: function (done) {
        $.ajax({
            url: '/api/login/slack',
            type: 'POST',
            success: function (data) {
            },
            error: function (data, _, error) {
                done({
                    error: {
                        code: data.status,
                        title: error,
                        details: data.responseText
                    }
                });
            }
        });
    }

};