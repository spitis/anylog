import Immutable from 'immutable';

import {
  LOGIN_ATTEMPT,
  LOGIN_FAILED,
  LOGIN_SUCCESSFUL,
} from './actions.js';

const defaultState = new Immutable.Map({
  username: '',
  password: '',
  isLoggingIn: false,
  isLoggedIn: false,
  error: null,
});

export default function app(state = defaultState, action) {
  switch (action.type) {
    case LOGIN_ATTEMPT:
      return state.merge({
        isLoggingIn: true,
        isLoggedIn: false,
        username: action.username,
        password: action.password,
      });
    case LOGIN_FAILED:
      return state.merge({
        error: action.error,
        isLoggingIn: false,
        isLoggedIn: false,
      });
    case LOGIN_SUCCESSFUL:
      return state.merge({
        error: null,
        isLoggingIn: false,
        isLoggedIn: true,
      });
    default:
      return state;
  }
}
