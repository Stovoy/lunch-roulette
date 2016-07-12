import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { App } from './components/app';
import { LoginDone } from './components/auth';

var routes = (
    <MuiThemeProvider>
        <Router history={browserHistory}>
            <Route path="/" component={App}/>
            <Route path="/login/done" component={LoginDone}/>
        </Router>
    </MuiThemeProvider>
);

export var start = function () {
    ReactDOM.render(routes, document.getElementById('app'));
};
