#api/0_2/api.py

from flask import Blueprint, request, abort, g, jsonify
from sqlalchemy import or_
from anylog.api.models import User, Log, db
from anylog.api.basicAuth import requires_auth, requires_password_auth, authenticate
from anylog.api.schemas import userSchema, newEventSchema, getEventsSchema
import json
import plivo, plivoxml

api = Blueprint('api',__name__)

@api.route('/user', methods=['POST'])
def insert_user():
    """
    POST:
        Inserts user.
        Expects a username, email and password in JSON.
    """
    json = request.get_json(force=True, silent=True)

    username = json.get('username')
    email = json.get('email')
    password = json.get('password')
    if (username is None) or (email is None) or (password is None):
        return jsonify({
            'error': "Must provide valid username, email and password."
        }), 400
    if User.query.filter(or_(User.username==username,User.email==email)).first() is not None:
        return jsonify({
            'error': "Username or email already exists."
        }), 400

    try:
        u = User(username, email, password)
        db.session.add(u)
        db.session.commit()
        token = u.generate_auth_token(86400)
        return jsonify({
            'username': u.username,
            'token': token.decode('ascii'),
            'duration': 86400
        }), 200
    except Exception:
        return jsonify({
            'error': "Must provide valid username, email and password."
        }), 400

@api.route('/login', methods=['GET'])
@requires_auth
def login():
    """
    GET:
        If authorized, returns an authentication token.
    """
    token = g.user.generate_auth_token(86400)
    return jsonify({
        'username': g.user.username,
        'token': token.decode('ascii'),
        'duration': 86400
    }), 200

@api.route('/user/<string:username>', methods=['GET'])
@requires_auth
def get_user(username):
    """
    GET:
        Fetches a user's profile.
    """
    if username != g.user.username:
        return authenticate()

    res = dict(
        username = g.user.username,
        email = g.user.email,
        sms_number = g.user.sms_number
    )
    return jsonify({'profile': res}), 200

@api.route('/user/<string:username>', methods=['PUT'])
@requires_password_auth
def put_user(username):
    """
    PUT:
        Changes an attribute of the user.
    """
    if username != g.user.username:
        return authenticate()

    json = request.get_json(force=True, silent=True)
    if not json:
        return jsonify({
            'error': 'Request is not valid JSON'
        }), 400

    try:
        userSchema(json)
    except Exception as e:
        return jsonify({
            'error': 'Improper request. Check documentation and try again.'
        }), 400

    try:
        for i in list(json):
            if i == 'password':
                g.user.change_password(json[i])
            else:
                setattr(g.user, i, json[i])
        db.session.commit()

        res = dict(
            username = g.user.username,
            email = g.user.email,
            sms_number = g.user.sms_number
        )
        return jsonify({'profile': res}), 200

    except Exception as e:
        return {
            'error': 'unknown error'
        }, 400

@api.route('/logs', methods=['POST','GET'])
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
            offset: Integer
    """

    if request.method == 'POST':
        json = request.get_json(force=True, silent=True)
        args = request.args.to_dict()

        if not json:
            json = {}

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

        json['user'] = g.user

        try:
            newEventSchema(json)
        except Exception as e:
            return jsonify({
                'error': 'Improper request. Check documentation and try again.'
            }), 400

        try:
            log = Log(**json)
            db.session.add(log)
            db.session.commit()
            return '', 200
        except Exception as e:
            return jsonify({
                'error': 'unknown error'
            }), 400

    elif request.method == 'GET':
        args = request.args.to_dict()

        if args.get('timestart'):
            args['timestart'] = int(args['timestart'])
        if args.get('timestop'):
            args['timestop'] = int(args['timestop'])
        if args.get('max_events'):
            args['max_events'] = int(args['max_events'])
        if args.get('offset') is not None:
            args['offset'] = int(args['offset'])

        if len(args):
            try:
                getEventsSchema(args)
            except Exception:
                return jsonify({
                    'error': 'Improper request. Check documentation and try again.'
                }), 400

        query = Log.query.filter_by(user_id = g.user.id).\
            order_by(Log.timestamp.desc())

        if args.get('timestart'):
            query = query.filter(Log.timestamp > args['timestart'])
        if args.get('timestop'):
            query = query.filter(Log.timestamp < args['timestop'])
        if args.get('namespace'):
            query = query.filter(Log.namespace == args['namespace'])
        if args.get('event_name'):
            query = query.filter(Log.event_name == args['event_name'])
        if args.get('event_tags'):
            query = query.filter(Log.event_tags.contains(args['event_tags']))
        if args.get('max_events'):
            query = query.limit(args['max_events'])
        else:
            query = query.limit(100)
        if args.get('offset') is not None:
            query = query.offset(args['offset'])

        cols = Log.__table__.columns
        res = [row_to_json(row, cols) for row in query.all()]

        return jsonify({'logs': res}), 200

def row_to_json(row, cols):
    """
    Jsonify the sql alchemy query result.
    """
    convert = dict()
    convert['DATETIME'] = str
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
    return d
