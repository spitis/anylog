import React from 'react';

import {
  Table,
} from 'react-bootstrap';
import { Link } from 'react-router';
import VerificationIndicator from './VerificationIndicator';

import {
  fetchProfile,
  clearError,
} from '../actions';

export default class DataSources extends React.Component {

  componentWillMount() {
    const {
      loginToken,
      username,
    } = this.context.store.getState().user;
    let {
      emailVerified,
      smsVerified,
    } = this.context.store.getState().user;
    this.context.store.dispatch(fetchProfile(loginToken, username));
    this.unsubscribe = this.context.store.subscribe(() => {
      const user = this.context.store.getState().user;

      if (user.smsVerified && (!smsVerified)) {
        smsVerified = true;
        this.forceUpdate();
      } else if (user.emailVerified && (!emailVerified)) {
        emailVerified = true;
        this.forceUpdate();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.context.store.dispatch(clearError('fetchProfileError'));
  }

  render() {
    const { smsVerified, emailVerified } = this.context.store.getState().user;

    const verification = (verified, type) => (
      verified ?
        <VerificationIndicator verified>
          {type === 'SMS number' ?
            <div style={{ fontSize: '12px', width: '200%' }}>
              Verified! To log events by text, send a text to 17077776191.
              You can include an event description after a "@@".
            </div> :
            <div style={{ fontSize: '12px', width: '200%' }}>
              Verified! To log events by email, send an email
              to <a href="mailto:log@anylog.xyz">log@anylog.xyz</a>. The email
              subject will be the event name, and the body the description.
            </div>
          }
        </VerificationIndicator> :
        <VerificationIndicator>
          <div style={{ backgroundColor: '#f6f6f6' }}>
            <Link to="/editProfile">Verify your {type} on the account page.</Link>
          </div>
        </VerificationIndicator>
    );

    return (
      <Table>
        <thead>
          <tr>
            <th className="col-md-6">Source</th>
            <th className="col-md-6">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Email</td>
            <td>{verification(emailVerified, 'email')}</td>
          </tr>
          <tr>
            <td>SMS</td>
            <td>{verification(smsVerified, 'SMS number')}</td>
          </tr>
          <tr>
            <td>Calendar</td>
            <td>Coming soon!</td>
          </tr>
          <tr>
            <td>Mint</td>
            <td>Planned feature</td>
          </tr>
          <tr>
            <td>Web Browser</td>
            <td>Planned feature</td>
          </tr>
          <tr>
            <td>Fitbit</td>
            <td>Potential feature</td>
          </tr>
          <tr>
            <td>MyFitnessPal</td>
            <td>Potential feature</td>
          </tr>
          <tr>
            <td>LinkedIn</td>
            <td>Potential feature</td>
          </tr>
          <tr>
            <td>Facebook</td>
            <td>Potential feature</td>
          </tr>
          <tr>
            <td>Twitter</td>
            <td>Potential feature</td>
          </tr>
          <tr>
            <td>Reddit</td>
            <td>Potential feature</td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

DataSources.contextTypes = {
  store: React.PropTypes.object,
};
