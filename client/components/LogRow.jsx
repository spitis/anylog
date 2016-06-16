import React from 'react';
import {
  Button,
  ControlLabel,
  FormControl,
  Glyphicon,
} from 'react-bootstrap';
import Datetime from 'react-bootstrap-datetimepicker';
import moment from 'moment';
import '../styles/LogRow.scss';
import { updateLog, deleteLog } from '../actions';

export default class LogRow extends React.Component {
  state = {
    isEditing: false,
  }

  toggleEditing = (e) => {
    if (e) {
      if (e.button !== 0) {
        return;
      }
      e.stopPropagation();
    }

    if (this.state.isEditing) {
      window.removeEventListener('click', this.toggleEditing, false);
      this.setState({
        timestamp: moment(this.props.timestamp).format('X'),
        eventName: this.props.eventName,
        eventText: this.props.eventText,
      });
    } else {
      window.addEventListener('click', this.toggleEditing, false);
    }
    this.setState({
      isEditing: !this.state.isEditing,
    });
  }

  state = {
    timestamp: moment(this.props.timestamp).format('X'),
    eventName: this.props.eventName,
    eventText: this.props.eventText,
  }

  update = () => {
    this.props.dispatch(updateLog(this.props.authToken, {
      id: this.props.logId,
      eventName: this.state.eventName,
      timestamp: this.state.timestamp,
      eventText: this.state.eventText,
    }));
    this.toggleEditing();
  }

  delete = () => {
    this.props.dispatch(deleteLog(this.props.authToken, this.props.logId));
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      timestamp: moment(nextProps.timestamp).format('X'),
      eventName: nextProps.eventName,
      eventText: nextProps.eventText,
    });
  }

  render() {
    if (this.state.isEditing) {
      console.log(this.state);
      console.log(this.props);
      return (
        <tr onClick={(e) => e.stopPropagation()}>
          <td style={{ position: 'relative' }}>
            <Datetime
              dateTime={this.state.timestamp}
              format={'X'}
              inputFormat={'M/D/YY, h:mm a'}
              mode="time"
              onChange={ts => { this.setState({ timestamp: ts }); }}
            />
          </td>
          <td>
            <ControlLabel srOnly>Event Name</ControlLabel>
            <FormControl
              value={this.state.eventName}
              type="text"
              onChange={(e) => { this.setState({ eventName: e.target.value }); }}
              required
            />
          </td>
          <td>
            <ControlLabel srOnly>Event Name</ControlLabel>
            <FormControl
              value={this.state.eventText}
              onChange={(e) => { this.setState({ eventText: e.target.value }); }}
              type="text"
            />
          </td>
          <td>
            <Button block onClick={this.update}>Save</Button>
          </td>
        </tr>

      );
    }
    return (
      <tr>
        <td>{moment(this.props.timestamp).format('M/D/YY, h:mm a')}</td>
        <td>{this.props.eventName}</td>
        <td>{this.props.eventText}</td>
        <td className="edit-log" >
          <span onClick={this.toggleEditing}>
            <Glyphicon glyph="pencil" />
          </span>
          <span onClick={this.delete}>
            <Glyphicon glyph="remove" />
          </span>
        </td>
      </tr>
    );
  }
}

LogRow.propTypes = {
  logId: React.PropTypes.number,
  authToken: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  timestamp: React.PropTypes.string,
  eventName: React.PropTypes.string,
  eventText: React.PropTypes.string,
};
