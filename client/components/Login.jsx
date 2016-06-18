import React from 'react';
import LoginForm from './LoginForm';
import { Row, Col } from 'react-bootstrap';
import { login, clearError } from '../actions';

export default class Login extends React.Component {

  componentWillMount() {
    this.errorMessage = '';
    this.unsubscribe = this.context.store.subscribe(() => {
      const user = this.context.store.getState().user;
      if ((user.loginError && user / user.loginError.error)
        !== this.errorMessage) {
        this.errorMessage = user.loginError && user.loginError.error;
        this.forceUpdate();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.context.store.dispatch(clearError('loginError'));
  }

  loginHandler = (e) => {
    e.preventDefault();
    const { usernameOrEmail, password } = this.context.store.getState()
      .form.login;
    login(
      usernameOrEmail.value,
      password.value,
    )(this.context.store.dispatch);
  }

  render() {
    return (
      <Row
        style={this.props.padded ? { padding: '14px' } : null}
      >
        <Col
          sm={this.props.notCompressed ? 12 : 4}
          smOffset={this.props.notCompressed ? 0 : 4}
        >
          <LoginForm
            loginHandler={this.loginHandler}
            onSelect={this.props.onSelect}
            hideBottom={this.props.hideBottom}
            errorMessage={this.errorMessage}
          />
        </Col>
      </Row>
    );
  }
}

Login.contextTypes = {
  store: React.PropTypes.object,
};

Login.propTypes = {
  notCompressed: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
  hideBottom: React.PropTypes.bool,
  padded: React.PropTypes.bool,
};
