import React from 'react';
import '../styles/Navigation.scss';
import {
  Navbar,
  Nav,
  NavDropdown,
} from 'react-bootstrap';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { appName } from '../res/config.jsx';

import { logoutRedirect } from '../actions';

import Login from './Login.jsx';
import LoggedInDropdown from './LoggedInDropdown.jsx';

class Navigation extends React.Component {
  render() {
    const { user, logoutHandler } = this.props;
    let brandLink = user.isLoggedIn ? '/dashboard' : '/';
    let rightMenu = user.isLoggedIn ?
      <LoggedInDropdown
        user={user}
        logoutHandler={logoutHandler}
      /> :
      <NavDropdown title="Login" id="login-navdropdown">
        <Login notCompressed padded />
      </NavDropdown>;

    return (
      <Navbar className="navbar" fluid>
        <Navbar.Header>
          <div className="brand-centering-wrapper">
            <Navbar.Brand>
              <Link to={brandLink} className="title-font">{appName}</Link>
            </Navbar.Brand>
          </div>
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

Navigation.propTypes = {
  user: React.PropTypes.object.isRequired,
  logoutHandler: React.PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    user: state.user,
  }),
  (dispatch) => ({
    logoutHandler: () => { logoutRedirect(dispatch); },
  })
)(Navigation);
