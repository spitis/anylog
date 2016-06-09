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
    fields: { username, email, password, smsNumber, oldPassword },
    editProfileHandler,
    errorMessage,
  } = props;

  let error;
  if (errorMessage) {
    error = <div className="form-error">{errorMessage}</div>;
  }

  return (
    <div>
      {error}
      <form onSubmit={editProfileHandler}>
        <FormGroup controlId="editProfile-username">
          <ControlLabel>Username</ControlLabel>
          <FormControl
            {...username}
            type="text"
            placeholder="Username"
            required
          />
        </FormGroup>
        <FormGroup controlId="editProfile-email">
          <ControlLabel>Email address</ControlLabel>
          <FormControl
            {...email}
            type="email"
            placeholder="Email"
            required
          />
        </FormGroup>
        <FormGroup controlId="editProfile-sms">
          <ControlLabel>SMS Number</ControlLabel>
          <FormControl
            {...smsNumber}
            type="text"
            placeholder="SMS Number"
          />
        </FormGroup>
        <FormGroup controlId="editProfile-password">
          <ControlLabel>New Password</ControlLabel>
          <FormControl
            {...password}
            type="password"
            placeholder="New Password"
          />
        </FormGroup>
        <FormGroup controlId="editProfile-oldPassword">
          <ControlLabel>Please re-enter your password to make any changes:</ControlLabel>
          <FormControl
            {...oldPassword}
            type="password"
            placeholder="Old Password"
            required
          />
        </FormGroup>
        <Button type="submit" bsStyle="primary" block>
          Update Profile
        </Button>
      </form>
    </div>
  );
};

const EditProfileForm = reduxForm(
  {
    form: 'editProfile',
    fields: ['username', 'email', 'smsNumber', 'password', 'oldPassword'],
  },
  state => ({ // mapStateToProps
    initialValues: state.user,
  })
)(editProfileForm);

export default EditProfileForm;

editProfileForm.propTypes = {
  editProfileHandler: React.PropTypes.func,
  fields: React.PropTypes.object,
  errorMessage: React.PropTypes.string,
};
