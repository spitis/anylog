import React from 'react';

import {
  ControlLabel,
  FormGroup,
  FormControl,
  Button,
} from 'react-bootstrap';

const AddLogForm = (props) => {
  const {
      fields: {
        eventName,
        eventText,
      },
      handleSubmit,
    } = props;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="addLog-eventName">
          <ControlLabel>Event</ControlLabel>
          <FormControl
            {...eventName}
            type="text"
            placeholder=""
            required
          />
        </FormGroup>
        <FormGroup controlId="addLog-eventText">
          <ControlLabel>Description</ControlLabel>
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

AddLogForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  fields: React.PropTypes.object,
};

export default AddLogForm;
