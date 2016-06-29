import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, IndexRoute } from 'react-router';
import { browserHistory } from 'react-router';
import { App } from './components/app';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var routes = (
    <MuiThemeProvider>
        <Router history={browserHistory}>
            <Route path="/" component={App}/>
        </Router>
    </MuiThemeProvider>
);

export var start = function () {
    ReactDOM.render(routes, document.getElementById('app'));
};
