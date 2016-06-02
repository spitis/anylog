import React from 'react';
import '../styles/LoginDropdown.scss';
import { Link } from 'react-router';

import {
  NavDropdown,
  ControlLabel,
  FormGroup,
  FormControl,
  Button,
} from 'react-bootstrap';

export default () => (
  <NavDropdown title="Login" id="login-navdropdown">
    <LoginFormDropdown />
  </NavDropdown>
);

const LoginFormDropdown = (props) => (
  <div id="login-dp">
    <form>
      <FormGroup controlId="login-email">
        <ControlLabel srOnly>Email address</ControlLabel>
        <FormControl
          onSelect={(e) => e.stopPropagation()}
          type="email"
          placeholder="Email address"
          required
        />
      </FormGroup>
      <FormGroup controlId="login-password">
        <ControlLabel srOnly>Password</ControlLabel>
        <FormControl
          onSelect={(e) => e.stopPropagation()}
          type="password"
          placeholder="Password"
          required
        />
      </FormGroup>
      <div className="help-block text-right">
        <Link to="forgotpassword" onClick={() => (props.onSelect())}>
          Forgot password
        </Link>
      </div>
      <Button type="submit" bsStyle="primary" block>
        Sign in
      </Button>
      {/* <div className="checkbox">
            <label>
              <input type="checkbox" />
              keep me logged-in
            </label>
          </div>*/}
    </form>
    <div className="bottom text-center">
      New?&nbsp;&nbsp;&nbsp;
      <Link to="/createaccount" onClick={() => (props.onSelect())}>
          Create an account
      </Link>
    </div>
  </div>
);

LoginFormDropdown.propTypes = {
  onSelect: React.PropTypes.func,
};
