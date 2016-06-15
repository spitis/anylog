from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSONB, ARRAY, BIGINT
from itsdangerous import (TimedJSONWebSignatureSerializer,\
    BadSignature, SignatureExpired)
db = SQLAlchemy()

#UTILS
from datetime import datetime
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["pbkdf2_sha512"])
import re
EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")


"""

    MODEL CONFIG

"""

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column('id', db.Integer, primary_key=True)
    username = db.Column('username', db.String, nullable=False, unique=True)
    email = db.Column('email', db.String, nullable=False, unique=True)

    sms_number = db.Column('sms_number', BIGINT, unique=True)

    password = db.Column('password', db.String, nullable=False)
    active = db.Column('active', db.Boolean)

    registered_on = db.Column('registered_on', db.DateTime(timezone=True))
    sms_verified = db.Column('sms_verified', db.Boolean, default=False, server_default='f')
    sms_verified_on = db.Column('sms_verified_on', db.DateTime(timezone=True))
    email_verified = db.Column('email_verified', db.Boolean, default=False, server_default='f')
    email_verified_on = db.Column('email_verified_on', db.DateTime(timezone=True))

    def __init__(self, username, email, password):
        """
        Inserts a new user into the database.
        """
        if len(username) < 4:
            raise ValueError("Username must be at least 4 characters.")
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters.")
        if not EMAIL_REGEX.match(email):
            raise ValueError("Invalid email.")
        if EMAIL_REGEX.match(username): #Don't confuse usernames and emails
            raise ValueError("Invalid username.")

        self.username = username
        self.email = email
        self.password = pwd_context.encrypt(password)
        self.registered_on = datetime.now()
        self.active = True

    def change_password(self, newPassword):
        self.password = pwd_context.encrypt(newPassword)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password)

    def generate_auth_token(self, expiration=600):
        s = TimedJSONWebSignatureSerializer(current_app.config['SECRET_KEY'],\
            expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = TimedJSONWebSignatureSerializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None    # invalid token
        user = User.query.get(data['id'])
        return user

    def __repr__(self):
        return '<User %r>' % self.username

class Log(db.Model):
    __tablename__ = 'logs'

    id = db.Column('id', db.Integer, primary_key=True)
    timestamp = db.Column('timestamp', db.DateTime(timezone=True))
    namespace = db.Column('namespace', db.String, nullable=False)
    event_name = db.Column('event_name', db.String, nullable=False)
    event_tags = db.Column('event_tags', ARRAY(db.String))
    event_json = db.Column('event_json', JSONB)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'),\
        nullable=False)

    user = db.relationship('User', backref=db.backref('logs', lazy='dynamic'))

    def __init__(self, user, event_name, event_tags=[], event_json=None,\
        namespace='Custom', timestamp=None):
        self.timestamp = timestamp or datetime.now()
        self.namespace = namespace
        self.event_name = event_name
        self.event_tags = event_tags
        self.event_json = event_json
        self.user = user

    def __repr__(self):
        return '<Log {0} | {1} : {2}>'.format(self.timestamp, self.event_name,\
            self.event_json)
