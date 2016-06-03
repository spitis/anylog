#api/0_2/api.py

from flask import Blueprint, request, abort, g
from sqlalchemy import or_
from api.models import User, db
from api.basicAuth import requires_auth, authenticate
from api.schemas import userSchema

api = Blueprint('api',__name__)

@api.route('/', methods=['GET'])
def hello():
    return "Welcome to Anylog v0.2!"

@api.route('/user', methods=['POST'])
def insert_user():
    """
    POST:
        Inserts user.
        Expects a username and a password in JSON.
    """
    json = request.get_json(force=True, silent=True)

    username = json.get('username')
    email = json.get('email')
    password = json.get('password')
    if (username is None) or (email is None) or (password is None):
        return "Must provide valid username, email and password.", 400
    if User.query.filter_by(username=username).first() is not None:
        return "User already exists.", 400
    if User.query.filter(or_(User.username==username,User.email==email)).first() is not None:
        return "Username or email already exists.", 400

    try:
        u = User(username, email, password)
        db.session.add(u)
        db.session.commit()
        return '', 200
    except Exception:
        return "Must provide valid username, email and password.", 400


@api.route('/user/<string:username>', methods=['POST'])
@requires_auth
def modify_user(username):
    """
    POST:
        Changes an attribute of the user.
    """
    if username != g.user.username:
        return authenticate()
    json = request.get_json(force=True, silent=True)

    if not json:
        return 'Request is not valid JSON.', 400

    try:
        userSchema(json)
    except Exception as e:
        return 'Improper request. Check documentation and try again.', 400

    try:
        for i in list(json):
            if i == 'password':
                g.user.change_password(json[i])
            else:
                setattr(g.user, i, json[i])
        db.session.commit()
        return '', 200
    except Exception as e:
        return str(e), 400
