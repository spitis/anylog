from flask import Blueprint, request, current_app
from anylog.api.models import User, Log, db
from datetime import datetime
import hashlib, hmac

def verify_mailgun(token, timestamp, signature):
    return signature == hmac.new(
        key=current_app.config['MAILGUN_API_KEY'].encode('utf-8'),
        msg='{}{}'.format(timestamp, token).encode('utf-8'),
        digestmod=hashlib.sha256).hexdigest()

email = Blueprint('email', __name__)

@email.route('/receive_mailgun_log', methods=['POST'])
def log_by_email():
    if not verify_mailgun(request.values.get('token'),
            request.values.get('timestamp'),
            request.values.get('signature')):
        return 'Unauthorized', 401

    email = str(request.values.get('from'))
    email = email[email.find("<")+1:email.find(">")]

    # Find user
    user = User.query.filter_by(email=email).first()
    if not user:
        return "Invalid user", 400

    if not user.email_verified:
        #do not log anything
        return 'Not verified', 400

    log = Log(user, request.values.get('subject'), event_json=
            {'text': request.values.get('stripped-text')})
    db.session.add(log)
    db.session.commit()
    return '', 200
