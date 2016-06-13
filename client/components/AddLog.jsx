import React from 'react';
import AddLogForm from './AddLogForm';
import { addLog } from '../actions';

export default class AddLog extends React.Component {

  addLogHandler = (e) => {
    e.preventDefault();
    const state = this.context.store.getState();
    const authToken = state.user.loginToken;
    const { eventName, eventText } = state.form.addLog;
    const args = [];
    if (eventText && eventText.value) {
      args.push(['event_json', { text: eventText.value }]);
    }
    addLog(
      authToken,
      eventName.value,
      ...args,
    )(this.context.store.dispatch);
  }

  render() {
    return (
      <AddLogForm addLogHandler={this.addLogHandler} />
    );
  }
}

AddLog.contextTypes = {
  store: React.PropTypes.object,
};
