from flask import Blueprint, current_app
from anylog.api.models import User, Log, db
import plivo

sms = Blueprint('sms', __name__)

@sms.route('/receive_sms', methods=['POST'])
def receive_sms():
    # Sender's phone numer
    from_number = request.values.get('From')
    # Receiver's phone number - Plivo number
    to_number = request.values.get('To')
    # The text which was received
    text = request.values.get('Text')

    # Save message to user
    user = User.query.filter_by(sms_number=int(from_number)).first()
    log = Log(user, text)
    db.session.add(log)
    db.session.commit()

    return '', 200

def send_sms(to_number, text):
    p = plivo.RestAPI(
            current_app.config['PLIVO_AUTH_ID'],
            current_app.config['PLIVO_AUTH_TOKEN'])
    params = {
        'src': '17077776191',
        'dst': str(to_number),
        'text': text.decode('utf-8')
    }
    res = p.send_message(params)
    return str(response[0])
