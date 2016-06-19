import EditProfileForm from './EditProfileForm';
import {
  fetchProfile,
  updateProfile,
  clearError,
  sendVerificationEmail,
  sendVerificationSms,
} from '../actions';
import { reset, reduxForm } from 'redux-form';

const EditProfile = reduxForm(
  {
    form: 'editProfile',
    fields: ['username', 'email', 'smsNumber', 'password', 'oldPassword'],
  },
  // map state to props
  (state) => ({
    errorMessage: (
      (state.user.updateProfileError && state.user.updateProfileError.error) ||
      (state.user.fetchProfileError && state.user.fetchProfileError.error)
    ),
    smsCountryCode: state.user.smsCountryCode,
    smsVerified: state.user.smsVerified,
    emailVerified: state.user.emailVerified,
    initialValues: state.user,
  }),
  // map dispatch to props
  (dispatch) => ({
    clearError: () => {
      dispatch(clearError('fetchProfileError'));
      dispatch(clearError('updateProfileError'));
    },
    fetchProfile: () => { dispatch(fetchProfile()); },
    verifySmsHandler: (e) => {
      e.target.setAttribute('disabled', true);
      e.target.innerHTML = 'Text sent!';
      dispatch(sendVerificationSms());
    },
    verifyEmailHandler: (e) => {
      e.target.setAttribute('disabled', true);
      e.target.innerHTML = 'Email sent!';
      dispatch(sendVerificationEmail());
    },
    onSubmit: (fields) => {
      const {
        username,
        email,
        password,
        smsNumber,
        oldPassword,
      } = fields;
      const args = [];
      args.push(['username', username]);
      args.push(['email', email]);
      if (password) {
        args.push(['password', password]);
      }
      if (smsNumber) {
        args.push(['sms_number', +smsNumber]);
      }
      dispatch(reset('editProfile'));

      dispatch(
        updateProfile(
          oldPassword,
          ...args,
        )
      );
    },
  })
)(EditProfileForm);

export default EditProfile;
