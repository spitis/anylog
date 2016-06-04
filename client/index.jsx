import './styles/bootswatch.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import { createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import app from './reducers.js';

import routes from './routes.js';

let store = createStore(app, undefined, autoRehydrate());
persistStore(store, {}, loadApp);

// FOR DEBUGGING
window.store = store;
import { login } from './actions.js';
window.login = login;

function loadApp() {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory} routes={routes(store)} />
    </Provider>,
    document.getElementById('app')
  );
}
