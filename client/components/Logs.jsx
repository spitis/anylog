import React from 'react';
import { connect } from 'react-redux';
import { createSearchAction, getSearchSelectors } from 'redux-search';
import { createSelector } from 'reselect';

import { fetchLogs } from '../actions';
import {
  Button,
  Table,
  Glyphicon,
  FormControl,
} from 'react-bootstrap';
import dashItem from './wrappers/dashItem';
import page from './wrappers/page';
import '../styles/Logs.scss';
import exportJSONtoCSV from '../res/exportJSONtoCSV';
import LogRow from './LogRow';

class Logs extends React.Component {
  componentDidMount() {
    this.fetchLogs();
  }

  rightDashHeader = () => (
    <span>
      <Glyphicon glyph="refresh" onClick={this.fetchLogs} />
      <Glyphicon
        glyph="save"
        onClick={this.exportToCSV(this.props.logs || [])}
      />
    </span>
  );

  rightPageHeader = () => (
    <span>
      <Button onClick={this.fetchLogs}>Refresh</Button>&nbsp;
      <Button onClick={this.exportToCSV(this.props.logs || [])}>Export</Button>
    </span>
  )

  exportToCSV = (logs) => () => {
    exportJSONtoCSV(logs, 'export');
  }

  fetchLogs = () => {
    this.props.dispatch(fetchLogs());
  }

  render() {
    const { logIds, logs, logsM, searchText, searchLogs, dispatch } = this.props;
    const noFilter = logIds.length === logs.length;
    return (
      <div>
        <FormControl
          type="text"
          placeholder="Filter"
          value={searchText}
          onChange={(e) => dispatch(searchLogs(e.target.value))}
        />
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
              {logs.map((log, i) => {
                if (noFilter || logIds.indexOf(log.id) !== -1) {
                  return (
                    <LogRow
                      key={i}

                      logId={log.id}
                      dispatch={this.props.dispatch}

                      timestamp={log.timestamp}
                      eventName={log.event_name}
                      eventText={log.event_json && log.event_json.text}
                    />
                  );
                }
                return null;
              }
              )}
            </tbody>
          </Table>
        </form>
      </div>
    );
  }
}

Logs.propTypes = {
  logs: React.PropTypes.array.isRequired,
  searchLogs: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func,
};


// REDUX-SEARCH
// This whole redux-search thing is a bit hacky due to the requirement that
// the state be a map of id --> object, which loses the time order.
// To be seen if this lags with lots of logs or not.
//
const logsMap = state => state.logs.logsMap;
// :text is a selector that returns the text logs are currently filtered by
// :result is an Array of logs ids that match the current seach :text
const {
  text, // search text
  result, // book ids
} = getSearchSelectors({
  resourceName: 'logsMap',
  resourceSelector: (resourceName, state) => state.logs[resourceName],
});

const selectors = createSelector(
  [result, logsMap, text],
  (logIds, logsM, searchText) => ({
    logIds,
    logsM,
    searchText,
  })
);

const mapStateToProps = (state, ownProps) => ({
  logs: state.logs.logs,
  ...(selectors(state, ownProps)),
});
const mapDispatchToProps = (dispatch) => ({
  searchLogs: createSearchAction('logsMap'),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Logs);

export const LogsDash = connect(mapStateToProps, mapDispatchToProps)(dashItem(Logs, 'Logs'));
export const LogsPage = connect(mapStateToProps, mapDispatchToProps)(page(Logs, 'Logs'));
