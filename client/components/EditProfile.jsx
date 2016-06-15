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
      smsCountryCode,
    } = this.context.store.getState().user;
    this.context.store.dispatch(fetchProfile(loginToken, username));

    this.unsubscribe = this.context.store.subscribe(() => {
      const user = this.context.store.getState().user;

      if ((user.smsVerified && (!smsVerified)) ||
         (user.emailVerified && (!emailVerified)) ||
         (user.smsCountryCode !== smsCountryCode) ||
         (user.fetchProfileError) ||
         (user.updateProfileError) ||
         (this.errorMessage)) {
        emailVerified = user.emailVerified;
        smsVerified = user.smsVerified;
        smsCountryCode = user.smsCountryCode;
        this.errorMessage = user.fetchProfileError && user.fetchProfileError.error;
        this.errorMessage = user.updateProfileError && user.updateProfileError.error;
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
    const { smsVerified, emailVerified, smsCountryCode } = this.context.store.getState().user;

    return (
      <Col lg={8} lgOffset={2}>
        <EditProfileForm
          editProfileHandler={this.editProfileHandler}
          errorMessage={this.errorMessage}
          smsVerified={smsVerified}
          emailVerified={emailVerified}
          smsCountryCode={smsCountryCode}
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
