import React from 'react';
import AddLogForm from './AddLogForm';
import { Col, Row } from 'react-bootstrap';
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
      <div>
        <h1>Add log</h1>
        <hr />
        <Row>
          <Col md={4} mdOffset={4}>
            <AddLogForm addLogHandler={this.addLogHandler} />
          </Col>
        </Row>
      </div>
    );
  }
}

AddLog.contextTypes = {
  store: React.PropTypes.object,
};
