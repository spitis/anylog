import re
from anylog.api.models import EMAIL_REGEX
from voluptuous import Schema, Required, Invalid, All, Length, Any
from datetime import datetime as dt

def Email(msg=None):
    def f(v):
        if EMAIL_REGEX.match(v):
            return str(v)
        else:
            raise Invalid(msg or ("incorrect email address"))
    return f

def NotEmail(msg=None):
    def f(v):
        if EMAIL_REGEX.match(v):
            raise Invalid(msg or ("cannot be an email address"))
        else:
            return str(v)
    return f

def POSIX(msg=None):
    def f(i):
        try:
            return dt.fromtimestamp(int(i))
        except:
            raise Invalid(msg or ("Invalid date format."))
    return f

newUserSchema = Schema({
    'username': All(str, Length(min=4, msg="Username must be at least 4 characters."), NotEmail("Username cannot be an email address.")),
    'password': All(str, Length(min=8, msg="Password must be at least 8 characters.")),
    'email': All(str, Email()),
})

userSchema = Schema({
    'username': All(str, Length(min=4), NotEmail()),
    'password': All(str, Length(min=8)),
    'email': All(str, Email()),
    'active': bool,
    'sms_number': int
})

updateEventSchema = Schema({
    'namespace': str,
    'event_name': str,
    'event_tags': [],
    'event_json': dict,
    'timestamp': POSIX()
})

newEventSchema = Schema({
    'namespace': str,
    Required('event_name'): str,
    Required('user'): object,
    'event_tags': [],
    'event_json': dict,
    'timestamp': int
})

getEventsSchema = Schema({
    'namespace': str,
    'event_name': str,
    'event_tags': [],
    'timestart': int,
    'timestop': int,
    'max_events': int,
    'offset': int
})
