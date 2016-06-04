import React from 'react';
import AddLogForm from './AddLogForm';
import { Col } from 'react-bootstrap';
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
      <Col md={4} mdOffset={4}>
        <AddLogForm addLogHandler={this.addLogHandler} />
      </Col>
    );
  }
}

AddLog.contextTypes = {
  store: React.PropTypes.object,
};
