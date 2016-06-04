import React from 'react';
import '../styles/LoginDropdown.scss';

import {
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';

const LoggedInDropdown = (props) => (
  <NavDropdown
    title={props.user.username}
    id="login-navdropdown"
  >
    <MenuItem onClick={props.logoutHandler}>Logout</MenuItem>
  </NavDropdown>
);

LoggedInDropdown.propTypes = {
  user: React.PropTypes.object,
  logoutHandler: React.PropTypes.func,
};

export default LoggedInDropdown;
