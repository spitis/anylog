import React from 'react';
import { fetchLogs } from '../actions';
import {
  Button,
  Table,
  Glyphicon,
} from 'react-bootstrap';
import dashItem from './wrappers/dashItem';
import page from './wrappers/page';
import '../styles/Logs.scss';
import exportJSONtoCSV from '../res/exportJSONtoCSV';
import LogRow from './LogRow';

export default class Logs extends React.Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
    this.fetchLogs();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  rightDashHeader = () => (
    <span>
      <Glyphicon
        glyph="refresh"
        onClick={this.fetchLogs}
      />
      <Glyphicon
        glyph="save"
        onClick={this.exportToCSV(this.context.store.getState().logs.logs || [])}
      />
    </span>
  );

  rightPageHeader = () => (
    <span>
      <Button onClick={this.fetchLogs}>Refresh</Button>&nbsp;
      <Button
        onClick={this.exportToCSV(
          this.context.store.getState().logs.logs || [])}
      >Export</Button>
    </span>
  )

  fetchLogs = () => {
    const authToken = this.context.store.getState().user.loginToken;
    fetchLogs(authToken)(this.context.store.dispatch);
  }

  exportToCSV = (logs) => () => {
    exportJSONtoCSV(logs, 'export');
  }

  render() {
    const state = this.context.store.getState();
    const logs = state.logs.logs || [];
    return (
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <Table responsive striped condensed>
          <thead>
            <tr>
              <th className="col-md-3">Timestamp</th>
              <th className="col-md-4">Event</th>
              <th className="col-md-4">Description</th>
              <th className="col-md-1"></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) =>
              <LogRow
                key={i}

                logId={log.id}
                authToken={state.user.loginToken}
                dispatch={this.context.store.dispatch}

                timestamp={log.timestamp}
                eventName={log.event_name}
                eventText={log.event_json && log.event_json.text}
              />
            )}
          </tbody>
        </Table>
      </form>
    );
  }
}

Logs.contextTypes = {
  store: React.PropTypes.object,
};

export const LogsDash = dashItem(Logs, 'Logs');
export const LogsPage = page(Logs, 'Logs');
