import { reduxForm } from 'redux-form';
import { clearError, createAccount } from '../actions';
import CreateAccountForm from './CreateAccountForm';

const CreateAccount = reduxForm(
  {
    form: 'createAccount',
    fields: ['username', 'email', 'password'],
  },
  // map state to props
  (state) => ({
    errorMessage: state.user.createAccountError && state.user.createAccountError.error,
  }),
  // map dispatch to props
  (dispatch) => ({
    clearErrorMessage: () => dispatch(clearError('createAccountError')),
    onSubmit: (fields) => {
      const { username, email, password } = fields;
      createAccount(
        username,
        email,
        password
      )(dispatch);
    },
  })
)(CreateAccountForm);

export default CreateAccount;
