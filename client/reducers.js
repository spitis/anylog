import { combineReducers } from 'redux';

import {
  ADD_LOG_ATTEMPT,
  ADD_LOG_RESULT,
  FETCH_LOGS_ATTEMPT,
  FETCH_LOGS_RESULT,
  CREATE_ACCOUNT_ATTEMPT,
  CREATE_ACCOUNT_FAILED,
  LOGIN_ATTEMPT,
  LOGIN_FAILED,
  LOGIN_SUCCESSFUL,
  LOGOUT,
} from './actions.js';

const logsDefaultState = {
  isAddingLog: false,
  addLogError: null,
  isFetchingLogs: false,
  fetchLogsError: null,
  logs: [],
};

function logs(state = logsDefaultState, action) {
  switch (action.type) {
    case ADD_LOG_ATTEMPT:
      return Object.assign({}, state, {
        isAddingLog: true,
      });
    case ADD_LOG_RESULT:
      return Object.assign({}, state, {
        isAddingLog: false,
        addLogError: action.error,
      });
    case FETCH_LOGS_ATTEMPT:
      return Object.assign({}, state, {
        isFetchingLogs: true,
        fetchLogsError: action.error,
        logs: action.logs,
      });
    case FETCH_LOGS_RESULT:
      return Object.assign({}, state, {
        isFetchingLogs: true,
        fetchLogsError: action.error,
        logs: action.logs,
      });
    default:
      return state;
  }
}

const userDefaultState = {
  isCreatingAccount: false,
  createAccountError: null,
  isLoggingIn: false,
  isLoggedIn: false,
  loginError: null,
  loginToken: null,
  username: null,
};

function user(state = userDefaultState, action) {
  switch (action.type) {
    case CREATE_ACCOUNT_ATTEMPT:
      return Object.assign({}, state, {
        isCreatingAccount: true,
        isLoggedIn: false,
      });
    case CREATE_ACCOUNT_FAILED:
      return Object.assign({}, state, {
        createAccountError: action.error,
        isCreatingAccount: false,
        isLoggedIn: false,
      });
    case LOGIN_ATTEMPT:
      return Object.assign({}, state, {
        isLoggingIn: true,
        isLoggedIn: false,
      });
    case LOGIN_FAILED:
      return Object.assign({}, state, {
        loginError: action.error,
        isLoggingIn: false,
        isLoggedIn: false,
      });
    case LOGIN_SUCCESSFUL:
      return Object.assign({}, state, {
        loginError: null,
        createAccountError: null,
        isLoggingIn: false,
        isCreatingAccount: false,
        isLoggedIn: true,
        loginToken: action.token,
        username: action.username,
      });
    case LOGOUT:
      return Object.assign({}, state, userDefaultState);
    default:
      return state;
  }
}

const app = combineReducers({
  user,
  logs,
});

export default app;
