import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import { LogsPage } from './components/Logs';
import AddLog from './components/AddLog';
import Dashboard from './components/Dashboard';
import Page404 from './components/Page404';
import CreateAccount from './components/CreateAccount';
import EditProfile from './components/EditProfile';
import Guide from './components/guide/Guide';

const redirectToDash = (store) => (
  (_, replaceState) => {
    const state = store.getState();
    if (state.user.loggedIn) {
      replaceState(null, '/dashboard');
    }
  }
);

export default (store) => (
  <Route path="/" component={App}>
    <IndexRoute
      component={Home}
      store={store}
      onEnter={redirectToDash(store)}
    />
  <Route path="/createaccount" component={CreateAccount} />
    <Route path="/logs" component={LogsPage} />
    <Route path="/addLog" component={AddLog} />
    <Route path="/editProfile" component={EditProfile} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/guide" component={Guide} />
    <Route path="*" component={Page404} />
  </Route>
);
