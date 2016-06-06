import React from 'react';

export default class LoggedInOnly extends React.Component {

  componentDidMount() {
    const { store } = this.context;
    this.loggedIn = store.getState().user.isLoggedIn;
    this.unsubscribe = store.subscribe(() => {
      const loggedIn = store.getState().user.isLoggedIn;
      if (loggedIn !== this.loggedIn) {
        this.loggedIn = loggedIn;
        this.forceUpdate();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const child = this.loggedIn ? this.props.children : null;
    return child;
  }
}

LoggedInOnly.propTypes = {
  children: React.PropTypes.element.isRequired,
};

LoggedInOnly.contextTypes = {
  store: React.PropTypes.object,
};
