import React from 'react';
import LoginForm from './LoginForm';
import { reduxForm } from 'redux-form';
import { login, clearError } from '../actions';

LoginForm.propTypes = {
  handleSubmit: React.PropTypes.func,
  // onSelect: React.PropTypes.func,
  // hideBottom: React.PropTypes.bool,
  //  padded: React.PropTypes.bool,
  //  notCompressed: React.PropTypes.bool,
  errorMessage: React.PropTypes.string,
};

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

export default Login;
