import React from 'react';
import Navigation from './Navigation.jsx';
import '../styles/anylog.scss';

export default (props) => (
  <div>
    <Navigation />
    <div className="container">
      {props.children}
    </div>
  </div>
);
