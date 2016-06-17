import React from 'react';
import CreateAccountForm from './CreateAccountForm';
import { Row, Col } from 'react-bootstrap';
import { createAccount } from '../actions';

export default class CreateAccount extends React.Component {

  createAccountHandler = (e) => {
    e.preventDefault();
    const { username, email, password } = this.context.store.getState().form.createAccount;
    createAccount(
      username.value,
      email.value,
      password.value
    )(this.context.store.dispatch);
  }

  render() {
    return (
      <Row>
        <Col
          sm={this.props.notCompressed ? 12 : 4}
          smOffset={this.props.notCompressed ? 0 : 4}
        >
          <CreateAccountForm createAccountHandler={this.createAccountHandler} />
        </Col>
      </Row>
    );
  }
}

CreateAccount.contextTypes = {
  store: React.PropTypes.object,
};

CreateAccount.propTypes = {
  notCompressed: React.PropTypes.bool,
};
