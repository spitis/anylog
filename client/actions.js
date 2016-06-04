import { browserHistory } from 'react-router';

/*
 * action types
 */

export const LOGIN_ATTEMPT = 'LOGIN_ATTEMPT';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL';
export const LOGOUT = 'LOGOUT';

export const CREATE_ACCOUNT_ATTEMPT = 'CREATE_ACCOUNT_ATTEMPT';
export const CREATE_ACCOUNT_FAILED = 'CREATE_ACCOUNT_FAILED';
export const CREATE_ACCOUNT_SUCCESSFUL = LOGIN_SUCCESSFUL;

/*
 * action creators
 */

export function loginError(error) {
  return { error, type: LOGIN_FAILED };
}

export function loginSuccess(responseJson) {
  browserHistory.push('/logs');
  return {
    token: responseJson.token,
    username: responseJson.username,
    type: LOGIN_SUCCESSFUL,
  };
}

export function loginRequest() {
  return { type: LOGIN_ATTEMPT };
}

export function logout() {
  browserHistory.push('/');
  return { type: LOGOUT };
}

export function createAccountError(error) {
  return { error, type: CREATE_ACCOUNT_FAILED };
}

export const createAccountSuccess = loginSuccess;

export function createAccountRequest() {
  return { type: CREATE_ACCOUNT_ATTEMPT };
}

/*
 * api callers
 */

export function login(usernameOrEmail, password) {
  return dispatch => {
    dispatch(loginRequest());
    fetch('http://localhost:3334/api/v0.2/login', {
      method: 'get',
      headers: {
        Authorization: `Basic ${btoa(`${usernameOrEmail}:${password}`)}`,
      },
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      const error = new Error(response.statusText);
      error.response = response;
      dispatch(loginError(error));
      throw error;
    }, error => {
       // TODO
    })
    .then((responseJson) => dispatch(loginSuccess(responseJson)
    ), error => {
        // TODO
    });
  };
}

export function createAccount(username, email, password) {
  return dispatch => {
    dispatch(createAccountRequest());
    fetch('http://localhost:3334/api/v0.2/user', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      const error = new Error(response.statusText);
      error.response = response;
      dispatch(createAccountError(error));
      throw error;
    }, error => {
       // TODO
    })
    .then((responseJson) => dispatch(createAccountSuccess(responseJson)
    ), error => {
        // TODO
    });
  };
}
