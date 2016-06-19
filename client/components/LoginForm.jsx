import React from 'react';
import { Link } from 'react-router';

import {
  ControlLabel,
  FormGroup,
  FormControl,
  Button,
  Row,
  Col,
} from 'react-bootstrap';

class LoginForm extends React.Component {

  componentWillUnmount() {
    this.props.clearError && this.props.clearError();
  }

  render() {
    const {
      fields: { usernameOrEmail, password },
      handleSubmit,
      errorMessage,
      onSelect,
      hideBottom,
      padded,
      notCompressed,
    } = this.props;

    let error;
    if (errorMessage) {
      error = <div className="form-error">{errorMessage}</div>;
    }

    // this is a hack to make the dropdown disappear when there is a dropdown.
    let selectHandler = () => null;
    if (onSelect) {
      selectHandler = onSelect;
    }

    return (
      <Row
        style={padded ? { padding: '14px' } : null}
      >
        <Col
          sm={notCompressed ? 12 : 4}
          smOffset={notCompressed ? 0 : 4}
        >
          <div id="login-dp">
            <form onSubmit={handleSubmit}>
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
            {hideBottom ?
              null :
              <div className="bottom text-center">
                New?&nbsp;&nbsp;&nbsp;
                <Link to="/createaccount" onClick={selectHandler}>
                    Create an account
                </Link>
              </div>
            }
          </div>
        </Col>
      </Row>
    );
  }
}

LoginForm.propTypes = {
  fields: React.PropTypes.object,
  handleSubmit: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  hideBottom: React.PropTypes.bool,
  errorMessage: React.PropTypes.string,
  clearError: React.PropTypes.func,
  padded: React.PropTypes.bool,
  notCompressed: React.PropTypes.bool,
};

export default LoginForm;
