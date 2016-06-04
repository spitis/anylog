import React from 'react';
import CreateAccountForm from './CreateAccountForm';
import { Col } from 'react-bootstrap';
import { createAccount } from '../actions';

export default class CreateAccount extends React.Component {

  createAccountHandler = (username, email, password) => (
    createAccount(username, email, password)(this.context.store.dispatch)
  )

  render() {
    return (
      <Col md={4} mdOffset={4}>
        <CreateAccountForm createAccountHandler={this.createAccountHandler} />
      </Col>
    );
  }
}

CreateAccount.contextTypes = {
  store: React.PropTypes.object,
};
