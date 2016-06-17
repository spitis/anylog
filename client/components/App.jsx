import React from 'react';
import Navigation from './Navigation.jsx';
import '../styles/anylog.scss';

export default (props) => (
  <div>
    {props.location.pathname === '/' ?
      null :
      <Navigation />}

    <div className="container">
      {props.children}
    </div>
  </div>
);
