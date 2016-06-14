/*
 * Small icon that indicates whether email is verified. OnClick it opens a menu
 * that offers a "send verification email option".
 */
import React from 'react';
import popoverHandle from './wrappers/popoverHandle';
import { Glyphicon } from 'react-bootstrap';

const handle = (props) => {
  let icon;
  let style;
  if (props.verified) {
    icon = <Glyphicon glyph="ok-sign" />;
    style = { cursor: 'pointer', color: 'green' };
  } else {
    icon = <Glyphicon glyph="exclamation-sign" />;
    style = { cursor: 'pointer', color: 'red' };
  }

  return (
    <div style={style}>
      {icon}
    </div>
  );
};

export default popoverHandle(handle);
