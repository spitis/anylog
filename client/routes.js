import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Logs from './components/Logs';
import AddLog from './components/AddLog';
import Page404 from './components/Page404';
import CreateAccount from './components/CreateAccount';

const redirectToLogs = (store) => (
  (_, replaceState) => {
    const state = store.getState();
    if (state.user.loggedIn) {
      replaceState(null, '/logs');
    }
  }
);

export default (store) => (
  <Route path="/" component={App}>
    <IndexRoute
      component={Home}
      store={store}
      onEnter={redirectToLogs(store)}
    />
    <Route path="/createaccount" component={CreateAccount} />
    <Route path="/logs" component={Logs} />
    <Route path="/addLog" component={AddLog} />
    <Route path="*" component={Page404} />
  </Route>
);
