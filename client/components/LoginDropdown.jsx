import React from 'react';
import '../styles/LoginDropdown.scss';
import LoginForm from './LoginForm';

import {
  NavDropdown,
} from 'react-bootstrap';

const LoginDropdown = (props) => (
  <NavDropdown title="Login" id="login-navdropdown">
    <LoginForm
      loginHandler={props.loginHandler}
    />
  </NavDropdown>
);

LoginDropdown.propTypes = {
  loginHandler: React.PropTypes.func,
};

export default LoginDropdown;
