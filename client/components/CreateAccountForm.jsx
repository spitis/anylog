import React from 'react';

import {
  ControlLabel,
  FormGroup,
  FormControl,
  Button,
} from 'react-bootstrap';

export default class CreateAccountForm extends React.Component {

  onChangeUser = (e) => {
    this.setState({ username: e.target.value });
  }
  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  }
  onChangePass = (e) => {
    this.setState({ password: e.target.value });
  }

  render() {
    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.props.createAccountHandler(
              this.state.username,
              this.state.email,
              this.state.password
            );
          }}
        >
          <FormGroup controlId="login-username">
            <ControlLabel srOnly>Username</ControlLabel>
            <FormControl
              onChange={this.onChangeUser}
              type="text"
              placeholder="Username"
              required
            />
          </FormGroup>
          <FormGroup controlId="login-email">
            <ControlLabel srOnly>Email address</ControlLabel>
            <FormControl
              onChange={this.onChangeEmail}
              type="email"
              placeholder="Email"
              required
            />
          </FormGroup>
          <FormGroup controlId="login-password">
            <ControlLabel srOnly>Password</ControlLabel>
            <FormControl
              onChange={this.onChangePass}
              type="password"
              placeholder="Password"
              required
            />
          </FormGroup>
          <Button type="submit" bsStyle="primary" block>
            Create account
          </Button>
        </form>
      </div>
    );
  }
}

CreateAccountForm.propTypes = {
  createAccountHandler: React.PropTypes.func,
};
