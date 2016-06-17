import React from 'react';

import Anchor from '../Anchor';

export default () => (
  <div className="guide-section">
    <h3 className="guide-section-header">
      <Anchor id="email">Email</Anchor>
    </h3>
    <p>
    To log an event through email, send an email from your verified email address
    to <a href="mailto:log@anylog.xyz">log@anylog.xyz</a> with the event name
    in the subject line and an optional description in the email body.
    </p>
    <p>
    Before you can log events by email, you need to verify your email. You can
    do this by visiting the <a href="/editProfile">account</a> page.
    </p>
  </div>
);
