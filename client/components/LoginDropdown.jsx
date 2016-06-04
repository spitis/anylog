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

const LoginDropdown = (props) => (
  <NavDropdown title="Login" id="login-navdropdown">
    <LoginFormDropdown loginHandler={props.loginHandler} />
  </NavDropdown>
);

LoginDropdown.propTypes = {
  loginHandler: React.PropTypes.func,
};

export default LoginDropdown;

class LoginFormDropdown extends React.Component {

  onChangeUser = (e) => {
    this.setState({ usernameOrEmail: e.target.value });
  }
  onChangePass = (e) => {
    this.setState({ password: e.target.value });
  }

  render() {
    return (
      <div id="login-dp">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.props.loginHandler(
              this.state.usernameOrEmail,
              this.state.password
            );
          }}
        >
          <FormGroup controlId="login-email">
            <ControlLabel srOnly>Username or Email</ControlLabel>
            <FormControl
              onSelect={(e) => e.stopPropagation()}
              onChange={this.onChangeUser}
              type="text"
              placeholder="Username or Email"
              required
            />
          </FormGroup>
          <FormGroup controlId="login-password">
            <ControlLabel srOnly>Password</ControlLabel>
            <FormControl
              onSelect={(e) => e.stopPropagation()}
              onChange={this.onChangePass}
              type="password"
              placeholder="Password"
              required
            />
          </FormGroup>
          <div className="help-block text-right">
            <Link to="forgotpassword" onClick={() => (this.props.onSelect())}>
              Forgot password
            </Link>
          </div>
          <Button
            type="submit"
            bsStyle="primary"
            block
          >
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
          <Link to="/createaccount" onClick={() => (this.props.onSelect())}>
              Create an account
          </Link>
        </div>
      </div>
    );
  }
}

LoginFormDropdown.propTypes = {
  onSelect: React.PropTypes.func,
  loginHandler: React.PropTypes.func,
};
