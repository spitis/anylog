import React from 'react';
import '../styles/LoginDropdown.scss';

import {
  NavDropdown,
  MenuItem,
  Glyphicon,
} from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap';

const LoggedInDropdown = (props) => {
  const title = <span><Glyphicon glyph="cog" /> {props.user.username}</span>;
  return (
    <NavDropdown
      title={title}
      id="login-navdropdown"
    >
      <LinkContainer to={{ pathname: '/dashboard' }}>
        <MenuItem>Dashboard</MenuItem>
      </LinkContainer>
      <LinkContainer to={{ pathname: '/editProfile' }}>
        <MenuItem>Account</MenuItem>
      </LinkContainer>
      <MenuItem divider />
      <MenuItem onClick={props.logoutHandler}>Logout</MenuItem>
    </NavDropdown>
  );
};

LoggedInDropdown.propTypes = {
  user: React.PropTypes.object,
  logoutHandler: React.PropTypes.func,
};

export default LoggedInDropdown;
