from flask import Blueprint, request, current_app
from anylog.api.models import User, Log, db
from datetime import datetime
import hashlib, hmac

def verify_mailgun(token, timestamp, signature):
    return signature == hmac.new(
        key=current_app.config['MAILGUN_API_KEY']),
        msg='{}{}'.format(timestamp, token),
        digestmod=hashlib.sha256).hexdigest()


email = Blueprint('email', __name__)

@email.route('/log', methods=['POST'])
def log_by_email():
    json = request.get_json(force=True, silent=True)

    with open('log.txt', 'w') as f:
        f.write("FROM: " + json.get('from') + "\n")
        f.write("SUBJECT: ") + json.get('subject') + "\n")
        f.write("TEXT: " + json.get('stripped-text') + "\n")
        f.write("TIMESTAMP " + json.get('timestamp'))

    return '', 200
