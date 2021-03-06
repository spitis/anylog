from flask import Blueprint, current_app, request
from anylog.api.models import User, Log, db
from datetime import datetime
import plivo
from phone_iso3166.country import phone_country

sms = Blueprint('sms', __name__)

@sms.route('/receive_sms', methods=['POST'])
def receive_sms():
    # Sender's phone numer
    from_number = int(request.values.get('From'))
    # Receiver's phone number - Plivo number
    to_number = int(request.values.get('To'))
    # The text which was received
    text = str(request.values.get('Text'))

    # Find user
    user = User.query.filter_by(sms_number=from_number).first()
    if not user:
        return "Invalid user", 400

    if not user.sms_verified:
        if text.strip().lower() == user.username.lower():
            user.sms_verified = True
            user.sms_verified_on = datetime.now()
            db.session.commit()
            send_sms(to_number, "Congrats your number is verified! Anything you text to this number will now be logged.")

        #do not log anything
        return '', 200

    text = text.split("@@")
    event_name = text[0].strip()
    event_text = ""
    if len(text) > 1:
        event_text = "".join(text[1:]).strip()

    log = Log(user, event_name, event_json={'text': event_text})
    db.session.add(log)
    db.session.commit()

    return '', 200

def send_sms(to_number, text):
    cc = phone_country(to_number)

    src = {
        'US': '17077776191',
        'CA': '13433441234'
    }.get(cc, '17077776191')

    p = plivo.RestAPI(
            current_app.config['PLIVO_AUTH_ID'],
            current_app.config['PLIVO_AUTH_TOKEN'])
    params = {
        'src': src,
        'dst': str(to_number),
        'text': text
    }
    res = p.send_message(params)
    return '', 200
