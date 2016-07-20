import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import { browserHistory } from 'react-router';

import { AppWrapper } from './components/app';
import { LoginDone } from './components/auth';

var routes = (
    <Router history={browserHistory}>
        <Route path="/" component={AppWrapper}/>
        <Route path="/login/done" component={LoginDone}/>
    </Router>
);

export var start = function () {
    ReactDOM.render(routes, document.getElementById('app'));
};
