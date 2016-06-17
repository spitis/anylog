import React from 'react';
import '../styles/Navigation.scss';
import {
  Navbar,
  Nav,
  NavDropdown,
  NavItem,
  Glyphicon,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';
import { appName } from '../res/config.jsx';

import { login, logoutRedirect } from '../actions';

import Login from './Login.jsx';
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

  logoutHandler = () => (logoutRedirect(this.context.store.dispatch))

  render() {
    const user = this.context.store.getState().user;
    let brandLink = user.isLoggedIn ? '/dashboard' : '/';
    let rightMenu = user.isLoggedIn ?
      <LoggedInDropdown
        user={user}
        logoutHandler={this.logoutHandler}
      /> :
      <NavDropdown title="Login" id="login-navdropdown">
        <Login notCompressed padded />
      </NavDropdown>;

    return (
      <Navbar className="navbar">
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={brandLink} className="title-font">{appName}</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse className="no-transition">
          <Nav pullRight className="right-top-nav nav navbar-nav">
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
