import React from 'react';

import Anchor from '../Anchor';

export default () => (
  <div className="guide-section">
    <h3 className="guide-section-header">
      <Anchor id="api-key">
        Automatic sync with IFTTT
      </Anchor>
    </h3>
    <p>
    Using your API key, which you can generate on the <a href="/editProfile">
    account</a> page, you can setup automatic logging from any service that
    can send an HTTP request. The easiest and most versatile service to
    do this with is IFTTT, but you could also try Zapier.
    </p>
    <h4>IFTTT</h4>
    <p><a href="https://ifttt.com/">If This Then That (IFTTT.com)</a> is a free
    service that can automatically submit logs to your Anylog account in response
    to events from over 100
    different data sources, from your phone GPS, to the weather forecast, to
    social media, productivity and business applications. A list of the available
    data sources can be found <a href="https://ifttt.com/channels">here</a>.
    </p>
    <p>
    Setting up IFTTT is easy:</p>
    <ol>
      <li>Replace the <span className="api-highlight">API key</span> in the URL below
        with your own API key to obtain your logging URL:</li>
      <pre>
        {"https://anylog.xyz/api/v0.2/log_with_api_key?api_key="}<span className="api-highlight">27e8ed5a-7901-4536-94a4-9ce59a56c331</span></pre>
      <li>Login to IFTTT and <a href="https://ifttt.com/myrecipes/personal/new">create a recipe</a>.</li>
      <li>Select and configure a channel to use as your input source (e.g., Reddit).</li>
      <li>As your Action Channel select the "<strong>Maker</strong>" channel, and configure it as follows:</li>
      <ul>
        <li><strong>URL:</strong> The URL with your API key from step 1 above</li>
        <li><strong>Method: </strong>POST</li>
        <li><strong>Content Type: </strong>application/json</li>
        <li><strong>Body:</strong></li>
      </ul>
      <pre>
        {'{'}<br />
        {'  "event_name":"'}<span className="api-highlight">YOUR EVENT NAME HERE</span>{'",'}<br />
        {'  "event_json": {'}<br />
        {'    "text": "'}<span className="api-highlight">YOUR EVENT DESCRIPTION HERE</span>{'"'}<br />
        {'   }'}<br />
        {'}'}
      </pre>
    </ol>
  </div>
);
