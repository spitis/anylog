import React from 'react';

import {
  ControlLabel,
  FormGroup,
  FormControl,
  Button,
  Row,
  Col,
} from 'react-bootstrap';

class CreateAccountForm extends React.Component {

  componentWillUnmount() {
    this.props.clearErrorMessage && this.props.clearErrorMessage();
  }

  render() {
    const {
      fields: { username, email, password },
      handleSubmit,
      errorMessage,
      notCompressed,
    } = this.props;

    let error;
    if (errorMessage) {
      error = <div className="form-error">{errorMessage}</div>;
    }

    return (
      <Row>
        <Col
          sm={notCompressed ? 12 : 4}
          smOffset={notCompressed ? 0 : 4}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <FormGroup controlId="login-username">
                <ControlLabel srOnly>Username</ControlLabel>
                <FormControl
                  {...username}
                  type="text"
                  placeholder="Username"
                  required
                />
              </FormGroup>
              <FormGroup controlId="login-email">
                <ControlLabel srOnly>Email address</ControlLabel>
                <FormControl
                  {...email}
                  type="email"
                  placeholder="Email"
                  required
                />
              </FormGroup>
              <FormGroup controlId="login-password">
                <ControlLabel srOnly>Password</ControlLabel>
                <FormControl
                  {...password}
                  type="password"
                  placeholder="Password"
                  required
                />
              </FormGroup>
              {error}
              <Button type="submit" block>
                Create account
              </Button>
            </form>
          </div>
        </Col>
      </Row>
    );
  }
}

CreateAccountForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  fields: React.PropTypes.object.isRequired,
  errorMessage: React.PropTypes.string,
  clearErrorMessage: React.PropTypes.func,
  notCompressed: React.PropTypes.bool,
};

export default CreateAccountForm;
