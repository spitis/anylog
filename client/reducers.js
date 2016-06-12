import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import {
  CLEAR_ERROR,
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
  UPDATE_PROFILE_ATTEMPT,
  UPDATE_PROFILE_FAILED,
  UPDATE_PROFILE_SUCCESS,
  FETCH_PROFILE_ATTEMPT,
  FETCH_PROFILE_RESULT,
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
    case CLEAR_ERROR:
      if (
        action.errorName === 'addLogError' ||
        action.errorName === 'fetchLogsError'
      ) {
        const cleared = {};
        cleared[action.errorName] = null;
        return Object.assign({}, state, cleared);
      }
      return state;
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
      });
    case FETCH_LOGS_RESULT:
      return Object.assign({}, state, {
        isFetchingLogs: false,
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

  isFetchingProfile: false,
  fetchProfileError: null,
  isUpdatingProfile: false,
  updateProfileError: null,

  // PROFILE INFO
  username: null,
  email: null,
  emailVerified: false,
  smsNumber: null,
  smsVerified: false,
};

function user(state = userDefaultState, action) {
  switch (action.type) {
    case CLEAR_ERROR:
      if (
        action.errorName === 'createAccountError' ||
        action.errorName === 'loginError' ||
        action.errorName === 'fetchProfileError' ||
        action.errorName === 'updateProfileError'
      ) {
        const cleared = {};
        cleared[action.errorName] = null;
        return Object.assign({}, state, cleared);
      }
      return state;
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
    case FETCH_PROFILE_ATTEMPT:
      return Object.assign({}, state, {
        isFetchingProfile: true,
      });
    case FETCH_PROFILE_RESULT:
      return Object.assign({}, state, {
        isFetchingProfile: false,
        fetchProfileError: action.error,
        username: action.profile.username,
        email: action.profile.email,
        smsNumber: action.profile.sms_number,
        emailVerified: action.profile.email_verified,
        smsVerified: action.profile.sms_verified,
      });
    case UPDATE_PROFILE_ATTEMPT:
      return Object.assign({}, state, {
        isUpdatingProfile: true,
      });
    case UPDATE_PROFILE_FAILED:
      return Object.assign({}, state, {
        isUpdatingProfile: false,
        updateProfileError: action.error,
      });
    case UPDATE_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        isUpdatingProfile: false,
        updateProfileError: null,
        username: action.profile.username,
        email: action.profile.email,
        smsNumber: action.profile.sms_number,
        emailVerified: action.profile.email_verified,
        smsVerified: action.profile.sms_verified,
      });
    default:
      return state;
  }
}

const app = combineReducers({
  user,
  logs,
  form: formReducer,
});

export default app;
