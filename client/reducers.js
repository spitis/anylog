import { combineReducers } from 'redux';

import {
  CREATE_ACCOUNT_ATTEMPT,
  CREATE_ACCOUNT_FAILED,
  LOGIN_ATTEMPT,
  LOGIN_FAILED,
  LOGIN_SUCCESSFUL,
  LOGOUT,
} from './actions.js';

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
});

export default app;
