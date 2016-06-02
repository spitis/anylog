import './styles/bootswatch.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import Home from './components/Home.jsx';
import Page404 from './components/Page404.jsx';
import CreateAccount from './components/CreateAccount.jsx';

import { Router, Route, browserHistory, IndexRoute } from 'react-router';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/createaccount" component={CreateAccount} />
      <Route path="*" component={Page404} />
    </Route>
  </Router>,
  document.getElementById('app')
);
