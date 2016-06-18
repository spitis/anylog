import React from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';

import {
  ControlLabel,
  FormGroup,
  FormControl,
  Button,
} from 'react-bootstrap';

const loginForm = (props) => {
  const {
    fields: { usernameOrEmail, password },
    loginHandler,
    errorMessage,
  } = props;

  let error;
  if (errorMessage) {
    error = <div className="form-error">{errorMessage}</div>;
  }

  // this is a hack to make the dropdown disappear when there is a dropdown.
  let selectHandler = () => null;
  if (props.onSelect) {
    selectHandler = props.onSelect;
  }

  return (
    <div id="login-dp">
      <form onSubmit={loginHandler}>
        <FormGroup controlId="login-email">
          <ControlLabel srOnly>Username or Email</ControlLabel>
          <FormControl
            {...usernameOrEmail}
            onSelect={(e) => e.stopPropagation()}
            type="text"
            placeholder="Username or Email"
            required
          />
        </FormGroup>
        <FormGroup controlId="login-password">
          <ControlLabel srOnly>Password</ControlLabel>
          <FormControl
            {...password}
            onSelect={(e) => e.stopPropagation()}
            type="password"
            placeholder="Password"
            required
          />
        </FormGroup>
        {/* <div className="help-block text-right">
          <Link to="forgotpassword" onClick={selectHandler}>
            Forgot password
          </Link>
        </div>*/}
        {error}
        <Button type="submit" block>
          Sign in
        </Button>
      </form>
      {props.hideBottom ?
        null :
        <div className="bottom text-center">
          New?&nbsp;&nbsp;&nbsp;
          <Link to="/createaccount" onClick={selectHandler}>
              Create an account
          </Link>
        </div>
      }
    </div>
  );
};

const LoginForm = reduxForm({
  form: 'login',
  fields: ['usernameOrEmail', 'password'],
})(loginForm);

export default LoginForm;

loginForm.propTypes = {
  fields: React.PropTypes.object,
  loginHandler: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  hideBottom: React.PropTypes.bool,
  errorMessage: React.PropTypes.string,
};
