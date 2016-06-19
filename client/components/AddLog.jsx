import AddLogForm from './AddLogForm';
import { addLog } from '../actions';
import { reduxForm, reset } from 'redux-form';

const AddLog = reduxForm(
  {
    form: 'addLog',
    fields: ['eventName', 'eventText'],
  },
  // map state to props
  () => null,
  // map dispatch to props
  (dispatch) => ({
    onSubmit: (fields) => {
      const { eventName, eventText } = fields;
      const args = [];
      if (eventText) {
        args.push(['event_json', { text: eventText }]);
      }
      dispatch(reset('addLog'));
      dispatch(addLog(
        eventName,
        ...args,
      ));
    },
  })
)(AddLogForm);

export default AddLog;
