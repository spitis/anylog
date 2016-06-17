import React from 'react';

import Anchor from '../Anchor';

export default () => (
  <div className="guide-section">
    <h2 className="guide-section-header">
      <Anchor id="data-sources">Data Sources</Anchor>
    </h2>

    <p>
    The easiest way to manually enter logs is by sending a text or email to Anylog.
    </p>
    <p>
    It's also easy to use your API key to set up automatic data logging from sources such as:
    </p>
    <ul>
      <li>Android and iOS</li>
      <li>Fitbit and other wearables</li>
      <li>Twitter, Instagram, Facebook and other social media</li>
      <li>Trello, Evernote and other productivity apps</li>
      <li>Salesforce, Slack and other business apps</li>
    </ul>
  </div>
);
