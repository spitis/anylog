/*

  Main view rendered at "/".

  Renders Logs if user is logged in. Otherwise renders Splash page.

 */

import React from 'react';
import { browserHistory } from 'react-router';
import { frontCopy } from '../res/config.jsx';

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
      <div>
        {frontCopy}
      </div>
    );
  }
}

Home.contextTypes = {
  store: React.PropTypes.object,
};
