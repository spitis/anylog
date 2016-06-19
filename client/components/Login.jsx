import React from 'react';
import LoginForm from './LoginForm';
import { reduxForm } from 'redux-form';
import { login, clearError } from '../actions';

const Login = reduxForm(
  {
    form: 'login',
    fields: ['usernameOrEmail', 'password'],
  },
  (state) => ({
    errorMessage: state.user.loginError && state.user.loginError.error,
  }),
  (dispatch) => ({
    clearError: () => dispatch(clearError('loginError')),
    onSubmit: (fields) => {
      const { usernameOrEmail, password } = fields;
      login(
        usernameOrEmail,
        password,
      )(dispatch);
    },
  })
)(LoginForm);

Login.propTypes = {
  notCompressed: React.PropTypes.bool,
  onSelect: React.PropTypes.func, // this is passed in by bootstrap navdropdown
  hideBottom: React.PropTypes.bool,
  padded: React.PropTypes.bool,
};

export default Login;
