import React from 'react';
import '../styles/Navigation.scss';
import {
  Navbar,
  Nav,
  NavItem,
  Glyphicon,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';
import { appName } from '../res/config.jsx';

import { login, logoutRedirect } from '../actions';

import LoginDropdown from './LoginDropdown.jsx';
import LoggedInDropdown from './LoggedInDropdown.jsx';
import LoggedInOnly from './LoggedInOnly';

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
    let brandLink = user.isLoggedIn ? '/dashboard' : '/';
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
            <Link to={brandLink} className="title-font">{appName}</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse className="no-transition">
          <Nav pullRight className="nav navbar-nav">
            {/* <LoggedInOnly>
              <LinkContainer to={{ pathname: '/logs' }}>
                <NavItem onClick={e => e.target.blur()} eventKey={1}>
                  <Glyphicon glyph="list" /> Logs
                </NavItem>
              </LinkContainer>
            </LoggedInOnly>*/}
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
