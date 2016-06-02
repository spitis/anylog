/*
 * action types
 */

export const LOGIN_ATTEMPT = 'LOGIN_ATTEMPT';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL';

/*
 * action creators
 */

export function loginError(error) {
  return {
    error,
    type: LOGIN_FAILED,
  };
}

export function loginSuccess(response) {
  return dispatch => {
    dispatch({
      response,
      type: LOGIN_SUCCESSFUL,
    });
    // router.transitionTo('/dashboard');
  };
}

export function loginRequest(username, password) {
  return {
    username,
    password,
    type: LOGIN_ATTEMPT,
  };
}

export function login(userData) {
  return dispatch =>
     fetch('http://localhost/login', {
       method: 'post',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         email: userData.email,
         password: userData.password,
       }),
     })
     .then(response => {
       if (response.status >= 200 && response.status < 300) {
         console.log(response);
         dispatch(loginSuccess(response));
       } else {
         const error = new Error(response.statusText);
         error.response = response;
         dispatch(loginError(error));
         throw error;
       }
     })
     .catch(error => { console.log('request failed', error); });
}

export function changePassword(username, oldPassword, newPassword) {
  // TODO
  // return;
}

export function logout() {
  // TODO
  // return;
}
