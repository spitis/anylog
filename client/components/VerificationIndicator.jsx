/*
 * Small icon that indicates whether email is verified. OnClick it opens a menu
 * that offers a "send verification email option".
 */
import React from 'react';
import popoverHandle from './wrappers/popoverHandle';
import { Glyphicon } from 'react-bootstrap';

const handle = (props) => {
  let icon;
  if (props.verified) {
    icon = <Glyphicon glyph="ok-sign" />;
  } else {
    icon = <Glyphicon glyph="exclamation-sign" />;
  }

  return (
    <div style={{ cursor: 'pointer' }}>
      {icon}
    </div>
  );
};

export default popoverHandle(handle);
