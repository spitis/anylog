import React from 'react';
import { fetchLogs } from '../actions';
import {
  Button,
  Table,
} from 'react-bootstrap';
import '../styles/Logs.scss';

function stringify(stringOrJSON) {
  if (typeof stringOrJSON === 'object') {
    return JSON.stringify(stringOrJSON);
  }
  return stringOrJSON.toString();
}
function exportJSONtoCSV(JSONData, labels, filename) {
  // If JSONData is not an object then JSON.parse
  // will parse the JSON string in an Object
  const arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;

  let CSV = '';

  // This will generate the Label/Header
  let row = '';

  for (let i = 0; i < labels.length; i++) {
    row += `"${labels[i]}",`;
  }

  // remove trailing comma and add line break
  CSV += `${row.slice(0, -1)} \r\n`;

  // 1st loop is to extract each row
  for (let i = 0; i < arrData.length; i++) {
    row = '';

    // 2nd loop will extract each column and convert it in string comma-seprated
    for (let j = 0; j < labels.length; j++) {
      row += `"${stringify(arrData[i][labels[j]])}",`;
    }

    CSV += `${row.slice(0, -1)} \r\n`;
  }

  // Initialize file format you want csv or xls
  const uri = `data:text/csv;charset=utf-8,${escape(CSV)}`;

  // this trick will generate a temp <a /> tag
  const link = document.createElement('a');
  link.href = uri;

  // set the visibility hidden so it will not effect on your web-layout
  link.style = 'visibility:hidden';
  link.download = `${filename}.csv`;

  // this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

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

  fetchLogs = () => {
    const authToken = this.context.store.getState().user.loginToken;
    fetchLogs(authToken)(this.context.store.dispatch);
  }

  export = (logs) => () => {
    exportJSONtoCSV(logs, ['timestamp', 'event_name', 'event_json'], 'export');
  }

  render() {
    const state = this.context.store.getState();
    const logs = state.logs.logs || [];

    return (
      <div>
        <h2>
          <span style={{ float: 'right' }}>
            <Button onClick={this.fetchLogs}>Refresh</Button>&nbsp;
            <Button onClick={this.export(logs)}>Export</Button>&nbsp;
          </span>
        </h2>
        <Table responsive striped condensed>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) =>
              <Log
                key={i}
                timestamp={(new Date(log.timestamp)).toLocaleString()}
                eventName={log.event_name}
                eventText={log.event_json && log.event_json.text}
              />
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}

const Log = (props) => (
  <tr>
    <td>{props.timestamp}</td>
    <td>{props.eventName}</td>
    <td>{props.eventText}</td>
  </tr>
);

Logs.contextTypes = {
  store: React.PropTypes.object,
};

Log.propTypes = {
  timestamp: React.PropTypes.string,
  eventName: React.PropTypes.string,
  eventText: React.PropTypes.string,
};
