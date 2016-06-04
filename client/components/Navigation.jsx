import React from 'react';
import '../styles/bootswatch.scss';
import '../styles/Navigation.scss';
import {
  Navbar,
  Nav,
} from 'react-bootstrap';
import { Link } from 'react-router';
import { appName } from '../res/config.jsx';

import { login, logoutRedirect } from '../actions';

import LoginDropdown from './LoginDropdown.jsx';
import LoggedInDropdown from './LoggedInDropdown.jsx';

export default class Navigation extends React.Component {

  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
       this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
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

  logoutHandler = () => (logoutRedirect(this.context.store.dispatch))

  render() {
    const user = this.context.store.getState().user;
    let brandLink = user.isLoggedIn ? '/logs' : '/';
    let rightMenu = user.isLoggedIn ?
      <LoggedInDropdown
        user={user}
        logoutHandler={this.logoutHandler}
      /> :
      <LoginDropdown
        loginHandler={this.loginHandler}
      />;

    return (
      <Navbar className="navbar">
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={brandLink}>{appName}</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse className="no-transition">
          {/*
            <Nav className="nav navbar-nav">
              <NavItem className="active" eventKey={1} href="#home">Home</NavItem>
              <NavItem eventKey={2} href="#about">Blog</NavItem>
            </Nav>
          */}
          <Nav pullRight>
            {rightMenu}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Navigation.contextTypes = {
  store: React.PropTypes.object,
};
