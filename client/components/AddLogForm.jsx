import React from 'react';
import { reduxForm } from 'redux-form';

import {
  ControlLabel,
  FormGroup,
  FormControl,
  Button,
} from 'react-bootstrap';

const addLogForm = (props) => {
  const {
      fields: {
        eventName,
        eventText,
      },
      addLogHandler,
    } = props;

  return (
    <div>
      <form onSubmit={addLogHandler}>
        <FormGroup controlId="addLog-eventName">
          <ControlLabel>Event Name</ControlLabel>
          <FormControl
            {...eventName}
            type="text"
            placeholder=""
            required
          />
        </FormGroup>
        <FormGroup controlId="addLog-eventText">
          <ControlLabel>Event Text</ControlLabel>
          <FormControl
            {...eventText}
            type="text"
            placeholder="Optional"
          />
        </FormGroup>
        <Button type="submit" bsStyle="primary" block>
          Add log
        </Button>
      </form>
    </div>
  );
};

const AddLogForm = reduxForm({
  form: 'addLog',
  fields: ['eventName', 'eventText'],
})(addLogForm);

export default AddLogForm;

addLogForm.propTypes = {
  addLogHandler: React.PropTypes.func,
  fields: React.PropTypes.object,
};
