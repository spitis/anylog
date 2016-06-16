import React from 'react';
import { reduxForm } from 'redux-form';
import { generateApiKey } from '../actions';

import {
  Form,
  ControlLabel,
  FormControl,
  Button,
  Row,
  Col,
} from 'react-bootstrap';

const generateApiKeyForm = (props) => {
  const {
    fields: { password },
    authToken,
    username,
    apiKey,
  } = props;

  const generateHandler = (e) => {
    e.preventDefault();
    props.dispatch(generateApiKey(authToken, username, password.value));
  };

  return (
    <Form horizontal onSubmit={generateHandler}>
      <Row>
        <h3>Your API key</h3>
        <p>User this key to post logs from third-party services like IFTTT.</p>
      </Row>
      <Row>
        <Col sm={5}>
          <ControlLabel>
          {apiKey || 'Please generate a key.'}
          </ControlLabel>
        </Col>
        <Col sm={3}>
          <FormControl
            {...password}
            type="password"
            placeholder="Password"
            required
          />
        </Col>
        <Col sm={3}>
          <Button type="submit" block>
            Generate new
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

generateApiKeyForm.propTypes = {
  fields: React.PropTypes.object,
  authToken: React.PropTypes.string,
  username: React.PropTypes.string,
  apiKey: React.PropTypes.string,
  dispatch: React.PropTypes.func,
};

const GenerateApiKeyForm = reduxForm(
  {
    form: 'generateApiKey',
    fields: ['password'],
  },
  state => ({
    initialValues: state.user,
    authToken: state.user.loginToken,
    username: state.user.username,
    apiKey: state.user.apiKey,
  })
)(generateApiKeyForm);

export default GenerateApiKeyForm;
