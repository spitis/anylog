import './styles/bootswatch.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import { reduxSearch } from 'redux-search';

import app from './reducers.js';

import routes from './routes.js';

const searchEnhancer = reduxSearch({
  // Configure redux-search by telling it which resources to index for searching
  resourceIndexes: {
    logsMap: ({ resources, indexDocument }) => {
      Object.values(resources).forEach(log => {
        indexDocument(log.id, log.event_name);
        indexDocument(log.id, log.event_json && log.event_json.text || '');
      });
    },
  },
    // This selector is responsible for returning each collection of searchable resources
  resourceSelector: (resourceName, state) => state.logs[resourceName],
});


let store = createStore(
  app,
  {},
  compose(applyMiddleware(thunk), autoRehydrate(), searchEnhancer));

window.store = store;

function loadApp() {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory} routes={routes(store)} />
    </Provider>,
    document.getElementById('app')
  );
}

persistStore(store, {}, loadApp);
