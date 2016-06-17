/*

  Main view rendered at "/".

  Renders Logs if user is logged in. Otherwise renders Splash page.

 */

import React from 'react';
import { Link, browserHistory } from 'react-router';
import { Panel, Row, Col } from 'react-bootstrap';
import CreateAccount from './CreateAccount';
import Login from './Login';

export default class Home extends React.Component {

  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(this.handleStoreChange.bind(this));
    const user = store.getState().user;
    if (user.isLoggedIn) {
      browserHistory.push('/dashboard');
    }
  }

  componentWillUpdate() {
    const user = this.context.store.getState().user;
    if (user.isLoggedIn) {
      browserHistory.push('/dashboard');
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribe = null;
  }

  handleStoreChange() {
    if (!this.unsubscribe) return;
    this.forceUpdate();
  }

  render() {
    return (
      <Row>
        <div id="title-wrapper">
          <div className="title title-font">anylog</div>
          <div className="subtitle">Personal data logging and analytics. <Link to="/guide">Read the guide.</Link></div>
          <Col md={8} mdOffset={2}>
            <Panel>
              <Row>
                <Col sm={6} className="title-login">
                  <h3>Login</h3>
                  <Login notCompressed hideBottom />
                </Col>
                <Col sm={6} className="title-create-account">
                  <h3>Create Account</h3>
                  <CreateAccount notCompressed />
                </Col>
              </Row>
            </Panel>
          </Col>
        </div>
      </Row>
    );
  }
}

Home.contextTypes = {
  store: React.PropTypes.object,
};
