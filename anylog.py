# -*- coding: utf-8 -*-
"""

    Anylog API
    ~~~~~~~~~~
    Provides a simple REST api for logging events by user.

"""

import json
from flask import Flask, request, Response
import sqlalchemy as sa
from sqlalchemy.engine.url import URL
from passlib.context import CryptContext
from functools import wraps

from utils import schemas
import utils.expiringdictpy3 as ed

app = Flask(__name__)
pwd_context = CryptContext(schemes=["pbkdf2_sha512"])

#password cache containing up to 10000 username/password pairs, for 15 mins
password_cache = ed.ExpiringDict(max_len=10000, max_age_seconds=900)

# Load default config and override config from an environment variable
app.config.update(dict(
    DEBUG=True,
    SECRET_KEY='development key',

    DB_DRIVER='postgresql',
    DB_HOST='localhost',
    DB_PORT='5432',
    DB_USER='postgres',
    DB_PASS='alpha',
    DB_NAME='anylog',

    USERNAME='admin',
    PASSWORD='default'
))
app.config.from_envvar('ANYLOG_SETTINGS', silent=True)

"""
"
" DATABASE METHODS
"
"""

def create_engine():
    """
    Returns an engine connected to DB
    """
    return sa.create_engine(
        URL(
            drivername=app.config['DB_DRIVER'],
            host=app.config['DB_HOST'],
            port=app.config['DB_PORT'],
            username=app.config['DB_USER'],
            password=app.config['DB_PASS'],
            database=app.config['DB_NAME']
        )
    )

def connect_db():
    """
    Connects app to DB
    """
    app.engine = create_engine()
    app.metadata = sa.MetaData(bind=app.engine)
    app.metadata.reflect()

def validate_user(api_call):
    """
    Decorator to validate user before calling a function.
    If validation successful, provides a "user_id" argument to
    the decorated function.
    """
    @wraps(api_call)
    def wrapper(*args, **kwargs):
        schemas.username_password({
            'username': kwargs['username'],
            'password': kwargs['password']
        })

        user_table = app.metadata.tables['users']

        res = app.engine.execute(
            user_table.select().where(user_table.c.username == kwargs['username'])
        )

        user = res.fetchone()

        if user is None or not user['active']:
            raise NameError("User does not exist.")

        pw = None

        try:
            pw = password_cache[kwargs['username']]
        except:
            pass

        if pw and pw == kwargs['password']:
            pass
        else:
            if not pwd_context.verify(kwargs['password'], user['password']):
                raise ValueError("Incorrect password.")
            password_cache[kwargs['username']] = kwargs['password']

        return api_call(*args, **kwargs)
    return wrapper

def insert_user(username, password):
    """
    Inserts a new user into the database.
    """
    if len(username) < 4:
        raise ValueError("Username must be at least 4 characters.")
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters.")

    user_table = app.metadata.tables['users']

    #check if user exists
    res = app.engine.execute(
        user_table.select().where(user_table.c.username == username)
    )
    if len(res.fetchall()):
        raise ValueError("Username already exists.")

    user_id = app.engine.execute(
        user_table.insert().values(
            username=username,
            password=pwd_context.encrypt(password)
        )
    ).inserted_primary_key[0]

    if user_id:
        password_cache[username] = password

    return user_id

def hard_delete_user(username):
    """
    Deletes a user from the database
    """

    user_table = app.metadata.tables['users']

    user = app.engine.execute(
        user_table.select().where(user_table.c.username == username)
    ).fetchone()

    if user is None:
        raise NameError("User does not exist.")

    try:
        if username in password_cache:
            del password_cache[username]
    except:
        pass

    return app.engine.execute(
        user_table.delete().where(user_table.c.username == username)
    )

@validate_user
def soft_delete_user(username=None, password=None):
    """
    Soft deletes a user from the database by setting active==False.
    """
    user_table = app.metadata.tables['users']

    try:
        if username in password_cache:
            del password_cache[username]
    except:
        pass

    return app.engine.execute(
        user_table.update().values(
            active=False
        ).where(user_table.c.username == username)
    )

@validate_user
def change_password(new_password, username=None, password=None):
    """
    Changes a user's password.
    """
    if len(new_password) < 8:
        raise ValueError("Password must be at least 8 characters.")

    user_table = app.metadata.tables['users']

    password_cache[username] = new_password

    return app.engine.execute(
        user_table.update().values(
            password=pwd_context.encrypt(new_password)
        ).where(user_table.c.username == username)
    )

@validate_user
def log_event(event_name, event_tags=[], event_json=None,
    namespace="Custom", username=None, password=None, timestamp=None):
    """
    Logs an event
    """
    log_table = app.metadata.tables['logs']
    user_table = app.metadata.tables['users']

    user_id = app.engine.execute(
        sa.select([user_table.c.id]).where(user_table.c.username == username)
    ).fetchone()[0]

    #TODO validate namespace authorization, event_name, json
    values_to_insert = {
        'namespace': namespace,
        'event_name': event_name,
        'event_tags': event_tags,
        'event_json': event_json,
        'user_id': user_id
    }

    if timestamp:
        #TODO validate Timestamp
        values_to_insert['timestamp'] = timestamp

    return app.engine.execute(
        log_table.insert().values(values_to_insert)
    )

@validate_user
def get_events(max_events=100, timestart=None, timestop=None, namespace=None,
    event_name=None, event_tags=None, username=None, password=None):
    """
    Retrieves events
    """
    log_table = app.metadata.tables['logs']
    user_table = app.metadata.tables['users']

    user_id = app.engine.execute(
        sa.select([user_table.c.id]).where(user_table.c.username == username)
    ).fetchone()[0]

    #TODO? Validate various fields

    query = log_table.select().where(log_table.c.user_id == user_id)

    if timestart is not None:
        query = query.where(log_table.c.timestamp > timestart)
    if timestop is not None:
        query = query.where(log_table.c.timestamp < timestop)
    if namespace is not None:
        query = query.where(log_table.c.namespace == namespace)
    if event_name is not None:
        query = query.where(log_table.c.event_name == event_name)
    if event_tags is not None:
        query = query.where(log_table.c.event_tags.contains(event_logs))

    return app.engine.execute(query.limit(max_events)).fetchall()

"""
"
" REST API
"
"""

#No authorization required
@app.route('/users', methods=['POST'])
def users():
    """
    POST:
        Inserts user.
        Expects a username and a password in JSON.
    """

    try:
        u = request.json['username']
        p = request.json['password']
    except Exception as e:
        return "Bad request.", 400

    if type(u) != type("") or type(p) != type(""):
        return "Invalid username or password.", 400

    try:
        insert_user(
            username=u,
            password=p
        )
        return '', 200
    except ValueError as e:
        return str(e), 400
    except Exception as e:
        return "Bad request.", 400

def authenticate():
    """Sends a 401 response that enables basic auth"""
    return Response(
    'Could not verify your access level for that URL.\n'
    'You have to login with proper credentials', 401,
    {'WWW-Authenticate': 'Basic realm="Login Required"'})

def requires_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.authorization
        if not auth:
            return authenticate()
        return f(*args, **kwargs)
    return wrapper

@app.route('/users/<string:username>', methods=['POST','DELETE'])
@requires_auth
def modify_user(username):
    """
    POST:
        Changes a password.
        Expects a new_password field in JSON.
    DELETE:
        Deletes a user.
    """

    if request.method == 'POST':
        try:
            p = request.json['new_password']
        except Exception as e:
            return "Must specify new password.", 400

        try:
            change_password(
                new_password = p,
                username = request.authorization.username,
                password = request.authorization.password
            )
        except ValueError as e:
            return str(e), 400
        except Exception as e:
            return authenticate()

        return '', 200

    elif request.method == 'DELETE':
        try:
            soft_delete_user(
                username = request.authorization.username,
                password = request.authorization.password
            )
        except ValueError as e:
            return str(e), 400
        except Exception as e:
            return authenticate()

    return username

@app.route('/logs', methods=['POST','GET'])
@requires_auth
def logs():
    """
    POST:
        Posts a new event.
        Accepts JSON body _OR_ URL parameters:
            timestamp :: Integer -- Unix/POSIX time, milliseconds
            namespace :: String
            event_name :: String
            event_tags :: comma-separated String
            event_text :: String --> results in event_json: {text: <event_text>}
        URL parameters are OVERWRITTEN by body of request.

    GET:
        Retrieves events.
        Accepts URL parameters:
            namespace
            event_name
            event_tags
            timestart :: Integer
            timestop :: Integer
            max_events :: Integer
    """

    if request.method == 'POST':
        json = request.get_json(force=True, silent=True)
        args = request.args.to_dict()
        if 'event_text' in args:
            if 'event_json' in json:
                if not 'text' in json['event_json']:
                    json['event_json']['text'] = args['event_text']
            else:
                json['event_json'] = {
                    'text': args['event_text']
                }
            del args['event_text']

        if 'event_tags' in args:
            args['event_tags'] = args['event_tags'].split(',')

        json = {**args, **json}
        json['username'] = request.authorization.username
        json['password'] = request.authorization.password


        try:
            schemas.new_event(json)
        except:
            return "Invalid use of API. Check documentation.", 400

        try:
            log_event(**json)
        except Exception as e:
            return str(e), 400

        return '', 200

    elif request.method == 'GET':
        args = request.args.to_dict()

        args['username'] = request.authorization.username
        args['password'] = request.authorization.password

        try:
            schemas.get_events(args)
        except:
            return "Invalid use of API. Check documentation.", 400

        res = get_events(**args)
        cols = app.metadata.tables['logs'].columns

        res = [row_to_json(row, cols) for row in res]

        return str(res), 200

def row_to_json(row, cols):
    """
    Jsonify the sql alchemy query result.
    """
    convert = dict()
    convert['TIMESTAMP WITH TIME ZONE'] = str
    d = dict()
    for c in cols:
        v = getattr(row, c.name)
        if str(c.type) in convert.keys() and v is not None:
            try:
                d[c.name] = convert[str(c.type)](v)
            except:
                d[c.name] = "Error:  Failed to covert using ", str(convert[str(c.type)])
        elif v is None:
            d[c.name] = str()
        else:
            d[c.name] = v
    return json.dumps(d)

if __name__ == "__main__":
    connect_db()
    app.run(port=3334, debug=app.config['DEBUG'])
