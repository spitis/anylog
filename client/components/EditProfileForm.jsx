import React from 'react';
import { reduxForm } from 'redux-form';

import {
  Form,
  ControlLabel,
  FormGroup,
  FormControl,
  Button,
  Col,
  Row,
} from 'react-bootstrap';

import VerificationIndicator from './VerificationIndicator';


const editProfileForm = (props) => {
  const {
    fields: { username, email, password, smsNumber, oldPassword },
    editProfileHandler,
    errorMessage,
    smsVerified,
    verifySmsHandler,
    emailVerified,
    verifyEmailHandler,
  } = props;

  let error;
  if (errorMessage) {
    error = <div className="form-error">{errorMessage}</div>;
  }

  const validateSMS = (smsNumber) => /^1\d{10}$/.test(smsNumber);

  const smsValidationMessage = (handler) => {
    if (!props.fields.smsNumber.length) {
      return (
        <div style={{ fontSize: '12px', width: '200%' }}>
          To log events by SMS, please enter your SMS number.
          Anylog currently only supports North American numbers, e.g.,
          15554446666.
        </div>
      );
    } else if (validateSMS(props.fields.smsNumber)) {
      return (
        <Button onClick={handler} block>
          Verify now
        </Button>
      );
    }
    return (
      <div style={{ fontSize: '12px', width: '200%' }}>
        Anylog currently only supports North American numbers, e.g.,
        15554446666.
      </div>
    );
  };

  const verification = (toVerify, verified, handler) => {
    if (verified) {
      return (
        <VerificationIndicator verified>.
          {toVerify === 'sms' ?
            <div style={{ fontSize: '12px', width: '200%' }}>
              Verified! To log events by text, send a text to 17077776191.
              You can include an event description after a "@@".
            </div> :
            <div style={{ fontSize: '12px', width: '200%' }}>
              Verified! To log events by email, send an email to
              <a href="mailto:log@anylog.xyz">log@anylog.xyz</a>. The email
                subject will be the event name, and the body the description.
            </div>
          }
        </VerificationIndicator>
      );
    }
    return (
      <VerificationIndicator>
        {toVerify === 'sms' ?
          smsValidationMessage(handler) :
          <Button onClick={handler} block>
            Verify now
          </Button>
        }
      </VerificationIndicator>
    );
  };

  return (
    <div>
      {error}
      <Form horizontal onSubmit={editProfileHandler}>
        <FormGroup controlId="editProfile-username">
          <Col componentClass={ControlLabel} sm={3}>Username</Col>
          <Col sm={8}>
            <FormControl
              {...username}
              type="text"
              placeholder="Username"
              required
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="editProfile-email">
          <Col componentClass={ControlLabel} sm={3}>Email</Col>
          <Col sm={8}>
            <FormControl
              {...email}
              type="email"
              placeholder="Email"
              required
            />
          </Col>
          <Col sm={1} style={{ fontSize: '1.25em', padding: '8px 0' }}>
              {verification('email', emailVerified, verifyEmailHandler)}
          </Col>
        </FormGroup>
        <FormGroup controlId="editProfile-sms" block>
          <Col componentClass={ControlLabel} sm={3}>SMS Number</Col>
          <Col sm={8}>
            <FormControl
              {...smsNumber}
              type="text"
              placeholder="SMS Number"
            />
          </Col>
          <Col sm={1} style={{ fontSize: '1.25em', padding: '8px 0' }}>
            {verification('sms', smsVerified, verifySmsHandler)}
          </Col>
        </FormGroup>
        <FormGroup controlId="editProfile-password">
          <Col componentClass={ControlLabel} sm={3}>New Password</Col>
          <Col sm={8}>
            <FormControl
              {...password}
              type="password"
              placeholder="New Password"
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="editProfile-oldPassword">
          <Col sm={11}>
            <ControlLabel>
              Re-enter your password to make any changes:
            </ControlLabel>
            <FormControl
              {...oldPassword}
              type="password"
              placeholder="Old Password"
              required
            />
          </Col>
        </FormGroup>
        <Row>
          <Col sm={11}>
            <Button type="submit" bsStyle="primary" block>
              Update Profile
            </Button>
          </Col>
        </Row>
      </Form>
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
  smsVerified: React.PropTypes.bool,
  emailVerified: React.PropTypes.bool,
  verifySmsHandler: React.PropTypes.func,
  verifyEmailHandler: React.PropTypes.func,
};
