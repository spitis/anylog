import React from 'react';
import '../styles/LoginDropdown.scss';

import {
  NavDropdown,
  MenuItem,
  Glyphicon,
} from 'react-bootstrap';

const LoggedInDropdown = (props) => {
  const title = <span><Glyphicon glyph="cog" /> {props.user.username}</span>;
  return (
    <NavDropdown
      title={title}
      id="login-navdropdown"
    >
      <MenuItem onClick={() => null}>Account</MenuItem>
      <MenuItem onClick={() => null}>Data sources</MenuItem>
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
