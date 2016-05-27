from voluptuous import Schema, Required, Invalid, All, Length

username_password = Schema({
    Required('username'): All(str, Length(min=4)),
    Required('password'): All(str, Length(min=8))
})

new_event = Schema({
    'namespace': str,
    Required('event_name'): str,
    Required('username'): All(str, Length(min=4)),
    Required('password'): All(str, Length(min=8)),
    'event_tags': [],
    'event_json': dict,
    'timestamp': int
})

get_events = Schema({
    'namespace': str,
    'event_name': str,
    Required('username'): All(str, Length(min=4)),
    Required('password'): All(str, Length(min=8)),
    'event_tags': [],
    'timestart': int,
    'timestop': int,
    'max_events': int
})
