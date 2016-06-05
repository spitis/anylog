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

export const ADD_LOG_ATTEMPT = 'ADD_LOG_ATTEMPT';
export const ADD_LOG_RESULT = 'ADD_LOG_RESULT';

export const FETCH_LOGS_ATTEMPT = 'FETCH_LOGS_ATTEMPT';
export const FETCH_LOGS_RESULT = 'FETCH_LOGS_RESULT';

/*
 * DISPATCH REDIRECT HELPER
 */

export function redirectAfterAction(actionCreator, redirectUrl) {
  return (dispatch, ...args) => {
    dispatch(
      actionCreator(...args)
    );
    browserHistory.push(redirectUrl);
  };
}

/*
 * action creators
 */

export function loginError(error) {
  return { error, type: LOGIN_FAILED };
}

export function loginSuccess(responseJson) {
  return {
    token: responseJson.token,
    username: responseJson.username,
    type: LOGIN_SUCCESSFUL,
  };
}

export const loginSuccessRedirect = redirectAfterAction(loginSuccess, '/logs');

export function loginRequest() {
  return { type: LOGIN_ATTEMPT };
}

export function logout() {
  return { type: LOGOUT };
}

export const logoutRedirect = redirectAfterAction(logout, '/');

export function createAccountError(error) {
  return { error, type: CREATE_ACCOUNT_FAILED };
}

export const createAccountSuccess = loginSuccess;

export function createAccountRequest() {
  return { type: CREATE_ACCOUNT_ATTEMPT };
}

export function addLogRequest() {
  return { type: ADD_LOG_ATTEMPT };
}

export function addLogError(error) {
  return { error, type: ADD_LOG_RESULT };
}

export function addLogSuccess() {
  return { error: null, type: ADD_LOG_RESULT };
}

export const addLogSuccessRedirect = redirectAfterAction(addLogSuccess, '/logs');

export function fetchLogsRequest() {
  return { type: FETCH_LOGS_ATTEMPT };
}

export function fetchLogsError(error) {
  return { error, logs: [], type: FETCH_LOGS_RESULT };
}

export function fetchLogsSuccess(logs) {
  return { error: null, logs, type: FETCH_LOGS_RESULT };
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
    .then(
      (responseJson) => loginSuccessRedirect(dispatch, responseJson)
    , error => {
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

export function addLog(authToken, eventName, ...args) {
  return dispatch => {
    dispatch(addLogRequest());
    const argdict = {};
    for (let i = 0; i < args.length; i++) {
      argdict[args[i][0]] = args[i][1];
    }
    fetch('http://localhost:3334/api/v0.2/logs', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${authToken}:`)}`,
      },
      body: JSON.stringify({
        event_name: eventName,
        ...argdict,
      }),
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return addLogSuccessRedirect(dispatch);
      }
      const error = new Error(response.statusText);
      error.response = response;
      dispatch(addLogError(error));
      throw error;
    }, error => {
      // TODO catch any other errors?

    })
    .catch(error => {
      // TODO catch any other errors?
      if (error.response.status === 401) {
        logoutRedirect(dispatch);
      }
    });
  };
}

export function fetchLogs(authToken) {
  return dispatch => {
    dispatch(fetchLogsRequest());
    fetch('http://localhost:3334/api/v0.2/logs', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${authToken}:`)}`,
      },
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      const error = new Error(response.statusText);
      error.response = response;
      dispatch(addLogError(error));
      throw error;
    }, error => {
      // TODO catch any errors?
    })
    .then(
      responseJson => dispatch(
        fetchLogsSuccess(responseJson && responseJson.logs)
      ), error => {
        // TODO catch any other errors?
        if (error.response.status === 401) {
          logoutRedirect(dispatch);
        }
      });
  };
}