import React from 'react';

import Anchor from '../Anchor';
import { Table } from 'react-bootstrap';
import Flag from '../../mini/Flag';

export default () => (
  <div className="guide-section">
    <h3 className="guide-section-header">
      <Anchor id="sms">SMS</Anchor>
    </h3>
    <p>
    To log an event through SMS, send a text from your verified mobile number
    to Anylog at one of the numbers below.
    </p>
    <Table striped>
      <thead>
        <tr>
          <th>Country</th>
          <th>Number</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>United States ( <Flag cc="US" /> )</td>
          <td>+1 (707) 777-6191</td>
        </tr>
        <tr>
          <td>Canada ( <Flag cc="CA" /> )</td>
          <td>+1 (343) 344-1234</td>
        </tr>
      </tbody>
    </Table>

    <p>
    Before you can log events by text, you need to verify your mobile number.
    You can do this by first updating your mobile number on
    the <a href="/editProfile">account</a> page, and then texting your username to
    one of the numbers indicated above.
    </p>
  </div>
);
