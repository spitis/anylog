import React from 'react';
import '../styles/bootswatch.scss';
import '../styles/Navigation.scss';
import {
  Navbar,
  Nav,
} from 'react-bootstrap';
import { Link } from 'react-router';
import { appName } from '../res/config.jsx';
import LoginDropdown from './LoginDropdown.jsx';

export default () => (
  <Navbar className="navbar">
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">{appName}</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse className="no-transition">
      {/*
        <Nav className="nav navbar-nav">
          <NavItem className="active" eventKey={1} href="#home">Home</NavItem>
          <NavItem eventKey={2} href="#about">Blog</NavItem>
        </Nav>
      */}
      <Nav pullRight>
        <LoginDropdown />
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);
