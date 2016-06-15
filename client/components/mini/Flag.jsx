import React from 'react';

const Flag = (props) => {
  const cc = props.cc.toLowerCase();
  return (
    <img
      role="presentation"
      style={{ height: '0.9em', position: 'relative', top: '-1px' }}
      src={`${GLOBAL.STATIC_ROOT}/flags/${cc}.png`}
    />
  );
};

export default Flag;

Flag.propTypes = {
  cc: React.PropTypes.string.isRequired,
};
