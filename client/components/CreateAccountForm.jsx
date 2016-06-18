import React from 'react';
import { reduxForm } from 'redux-form';

import {
  ControlLabel,
  FormGroup,
  FormControl,
  Button,
} from 'react-bootstrap';

const createAccountForm = (props) => {
  const {
    fields: { username, email, password },
    createAccountHandler,
    errorMessage,
  } = props;

  let error;
  if (errorMessage) {
    error = <div className="form-error">{errorMessage}</div>;
  }

  return (
    <div>
      <form onSubmit={createAccountHandler}>
        <FormGroup controlId="login-username">
          <ControlLabel srOnly>Username</ControlLabel>
          <FormControl
            {...username}
            type="text"
            placeholder="Username"
            required
          />
        </FormGroup>
        <FormGroup controlId="login-email">
          <ControlLabel srOnly>Email address</ControlLabel>
          <FormControl
            {...email}
            type="email"
            placeholder="Email"
            required
          />
        </FormGroup>
        <FormGroup controlId="login-password">
          <ControlLabel srOnly>Password</ControlLabel>
          <FormControl
            {...password}
            type="password"
            placeholder="Password"
            required
          />
        </FormGroup>
        {error}
        <Button type="submit" block>
          Create account
        </Button>
      </form>
    </div>
  );
};

const CreateAccountForm = reduxForm({
  form: 'createAccount',
  fields: ['username', 'email', 'password'],
})(createAccountForm);

export default CreateAccountForm;

createAccountForm.propTypes = {
  createAccountHandler: React.PropTypes.func,
  fields: React.PropTypes.object,
  errorMessage: React.PropTypes.string,
};
