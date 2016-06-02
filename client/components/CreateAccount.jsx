import React from 'react';

import {
  ControlLabel,
  FormGroup,
  FormControl,
  Button,
  Col,
} from 'react-bootstrap';

export default () => (
  <div>
    <Col md={4} mdOffset={4}>
      <h3>Create Account</h3>
      <br />
      <form>
        <FormGroup controlId="login-email">
          <ControlLabel srOnly>Email address</ControlLabel>
          <FormControl
            type="email"
            placeholder="Email address"
            required
          />
        </FormGroup>
        <FormGroup controlId="login-password">
          <ControlLabel srOnly>Password</ControlLabel>
          <FormControl
            type="password"
            placeholder="Password"
            required
          />
        </FormGroup>
        <Button type="submit" bsStyle="primary" block>
          Create account
        </Button>
      </form>
    </Col>
  </div>
);
