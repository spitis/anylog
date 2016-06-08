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

export const UPDATE_PROFILE_ATTEMPT = 'UPDATE_LOG_ATTEMPT';
export const UPDATE_PROFILE_RESULT = 'UPDATE_PROFILE_RESULT';

export const FETCH_PROFILE_ATTEMPT = 'FETCH_PROFILE_ATTEMPT';
export const FETCH_PROFILE_RESULT = 'FETCH_PROFILE_RESULT';

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

export const createAccountSuccessRedirect = loginSuccessRedirect;

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

export function updateProfileRequest() {
  return { type: UPDATE_PROFILE_ATTEMPT };
}
export function updateProfileError(error) {
  return { error, type: UPDATE_PROFILE_RESULT };
}
export function updateProfileSuccess(profile) {
  return { error: null, profile, type: UPDATE_PROFILE_RESULT,
  };
}

export function fetchProfileRequest() {
  return { type: FETCH_PROFILE_ATTEMPT };
}
export function fetchProfileError(error) {
  return { error, type: UPDATE_PROFILE_RESULT };
}
export function fetchProfileSuccess(profile) {
  return { error: null, profile, type: FETCH_PROFILE_RESULT };
}

/*
 * api callers
 */

export function login(usernameOrEmail, password) {
  return dispatch => {
    dispatch(loginRequest());
    fetch(`${GLOBAL.API_ROOT}/login`, {
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
    fetch(`${GLOBAL.API_ROOT}/user`, {
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
    .then(
      (responseJson) => createAccountSuccessRedirect(dispatch, responseJson)
    , error => {
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
    fetch(`${GLOBAL.API_ROOT}/logs`, {
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
    fetch(`${GLOBAL.API_ROOT}/logs`, {
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

export function fetchProfile(authToken, username) {
  return dispatch => {
    dispatch(fetchProfileRequest());
    fetch(`${GLOBAL.API_ROOT}/user/${username}`, {
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
      dispatch(fetchProfileError(error));
      throw error;
    }, error => {
      // TODO catch any errors?
    })
    .then(
      responseJson => dispatch(
        fetchProfileSuccess(responseJson && responseJson.profile)
      ), error => {
        // TODO catch any other errors?
        if (error.response.status === 401) {
          logoutRedirect(dispatch);
        }
      });
  };
}

export function updateProfile(username, password, ...args) {
  return dispatch => {
    dispatch(updateProfileRequest());
    const argdict = {};
    for (let i = 0; i < args.length; i++) {
      argdict[args[i][0]] = args[i][1];
    }
    fetch(`${GLOBAL.API_ROOT}/user/${username}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
      body: JSON.stringify({
        ...argdict,
      }),
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      const error = new Error(response.statusText);
      error.response = response;
      dispatch(updateProfileError(error));
      throw error;
    }, error => {
      // TODO catch any errors?
    })
    .then(
      responseJson => dispatch(
        updateProfileSuccess(responseJson && responseJson.profile)
      ), error => {
        // TODO catch any other errors?
        if (error.response.status === 401) {
          logoutRedirect(dispatch);
        }
      });
  };
}
