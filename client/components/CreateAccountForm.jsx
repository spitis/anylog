import React from 'react';
import { reduxForm } from 'redux-form';

import {
  ControlLabel,
  FormGroup,
  FormControl,
  Button,
} from 'react-bootstrap';

const createAccountForm = (props) => {
  const { fields: { username, email, password }, createAccountHandler } = props;

  return (
    <div>
      <form onSubmit={createAccountHandler} ref="form">
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
        <Button
          onTouchEnd={this.refs.form.getDOMNode()
                      .dispatchEvent(new Event('submit'))}
          type="submit"
          bsStyle="primary"
          block
        >
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
};
