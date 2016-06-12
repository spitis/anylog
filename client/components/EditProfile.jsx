import React from 'react';
import EditProfileForm from './EditProfileForm';
import { Col } from 'react-bootstrap';
import {
  fetchProfile,
  updateProfile,
  clearError,
  sendVerificationEmail,
  sendVerificationSms,
} from '../actions';

export default class EditProfile extends React.Component {

  componentWillMount() {
    const {
      loginToken,
      username,
    } = this.context.store.getState().user;
    let {
      emailVerified,
      smsVerified,
    } = this.context.store.getState().user;
    this.context.store.dispatch(fetchProfile(loginToken, username));
    this.unsubscribe = this.context.store.subscribe(() => {
      const user = this.context.store.getState().user;

      if (user.smsVerified && (!smsVerified)) {
        smsVerified = true;
        this.forceUpdate();
      } else if (user.emailVerified && (!emailVerified)) {
        emailVerified = true;
        this.forceUpdate();
      } else if (user.fetchProfileError) {
        this.errorMessage = user.fetchProfileError.error;
        this.forceUpdate();
      } else if (user.updateProfileError) {
        this.errorMessage = user.updateProfileError.error;
        this.forceUpdate();
      } else if (this.errorMessage) {
        this.errorMessage = null;
        this.forceUpdate();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.context.store.dispatch(clearError('fetchProfileError'));
    this.context.store.dispatch(clearError('updateProfileError'));
  }

  editProfileHandler = (e) => {
    e.preventDefault();
    const state = this.context.store.getState();
    const oldUsername = state.user.username;
    const {
      username,
      email,
      password,
      smsNumber,
      oldPassword,
    } = state.form.editProfile;
    const args = [];
    args.push(['username', username.value]);
    args.push(['email', email.value]);
    if (password.value) {
      args.push(['password', password.value]);
    }
    if (smsNumber.value) {
      args.push(['sms_number', +smsNumber.value]);
    }

    this.context.store.dispatch(
      updateProfile(
        oldUsername,
        oldPassword.value,
        ...args,
      )
    );
  }

  verifyEmailHandler = (e) => {
    e.target.setAttribute('disabled', true);
    e.target.innerHTML = 'Email sent!';
    const token = this.context.store.getState().user.loginToken;
    sendVerificationEmail(token);
  }
  verifySmsHandler = (e) => {
    e.target.setAttribute('disabled', true);
    e.target.innerHTML = 'Text sent!';
    const token = this.context.store.getState().user.loginToken;
    sendVerificationSms(token);
  }

  render() {
    const { smsVerified, emailVerified } = this.context.store.getState().user;

    return (
      <Col lg={8} lgOffset={2}>
        <EditProfileForm
          editProfileHandler={this.editProfileHandler}
          errorMessage={this.errorMessage}
          smsVerified={smsVerified}
          emailVerified={emailVerified}
          verifySmsHandler={this.verifySmsHandler}
          verifyEmailHandler={this.verifyEmailHandler}
        />
      </Col>
    );
  }
}

EditProfile.contextTypes = {
  store: React.PropTypes.object,
};
