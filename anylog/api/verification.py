from flask import Blueprint, redirect, url_for, g, current_app, render_template
from anylog.api.models import User, db
from datetime import datetime
from anylog.api.basicAuth import requires_auth
from anylog.api.sms import send_sms
from itsdangerous import URLSafeTimedSerializer
import requests

verification = Blueprint('verification',__name__)

def generate_verification_token(email_or_sms):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email_or_sms)

def confirm_verification_token(token, expiration=259200):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email_or_sms = serializer.loads(
            token,
            max_age=expiration
        )
    except:
        return False
    return email_or_sms

@verification.route('/verify_email/<string:token>')
def verify_email(token):
    try:
        email = confirm_verification_token(token)
    except:
        return 'The verification link is invalid or has expired.', 400

    user = User.query.filter_by(email=email).first_or_404()
    if user.email_verified:
        return 'Already verified!', 200
    else:
        user.email_verified = True
        user.email_verified_on = datetime.now()
        db.session.commit()
        return 'Successfully verified!', 200

@verification.route('/send_email')
@requires_auth
def send_verification_email():
    if g.user.email_verified:
        return 'Aready verified.', 400
    email = g.user.email
    token = generate_verification_token(email)
    link = current_app.config['ROOT_URL'] + url_for('.verify_email',token=token)
    requests.post(
        current_app.config['MAILGUN_BASE_URL']+"/messages",
        auth=("api", current_app.config['MAILGUN_API_KEY']),
        data={"from": current_app.config['MAIL_DEFAULT_SENDER'],
              "to": email,
              "subject": "Verify your email",
              "html": render_template('email_confirm.html',
                        confirmation_link=link)})
    return 'Verification email sent!', 200

@verification.route('/send_sms')
@requires_auth
def send_verification_sms():
    if g.user.sms_verified:
        return 'Aready verified.', 400
    sms_number = g.user.sms_number

    send_sms(sms_number, "To verify your number, reply to this text\
        with your Anylog username."
