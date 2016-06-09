import React from 'react';
import EditProfileForm from './EditProfileForm';
import { Col } from 'react-bootstrap';
import { fetchProfile, updateProfile, clearError } from '../actions';

export default class EditProfile extends React.Component {

  componentWillMount() {
    const { loginToken, username } = this.context.store.getState().user;
    this.context.store.dispatch(fetchProfile(loginToken, username));
    this.unsubscribe = this.context.store.subscribe(() => {
      const user = this.context.store.getState().user;
      if (user.fetchProfileError) {
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

  render() {
    return (
      <Col md={6} mdOffset={3}>
        <EditProfileForm
          editProfileHandler={this.editProfileHandler}
          errorMessage={this.errorMessage}
        />
      </Col>
    );
  }
}

EditProfile.contextTypes = {
  store: React.PropTypes.object,
};
