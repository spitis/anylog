import React from 'react';
import { reduxForm } from 'redux-form';

import {
  ControlLabel,
  FormGroup,
  FormControl,
  Button,
} from 'react-bootstrap';

const editProfileForm = (props) => {
  const {
    fields: { username, email, password },
    editProfileHandler,
  } = props;

  return (
    <div>
      <form onSubmit={editProfileHandler}>
        <FormGroup controlId="login-username">
          <ControlLabel>Username</ControlLabel>
          <FormControl
            {...username}
            type="text"
            placeholder="Username"
            required
          />
        </FormGroup>
        <FormGroup controlId="login-email">
          <ControlLabel>Email address</ControlLabel>
          <FormControl
            {...email}
            type="email"
            placeholder="Email"
            required
          />
        </FormGroup>
        <FormGroup controlId="login-password">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            {...password}
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
};

const EditProfileForm = reduxForm({
  form: 'createAccount',
  fields: ['username', 'email', 'password'],
})(editProfileForm);

export default EditProfileForm;

editProfileForm.propTypes = {
  editProfileHandler: React.PropTypes.func,
  fields: React.PropTypes.object,
};
