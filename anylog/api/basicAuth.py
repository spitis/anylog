from functools import wraps
from flask import request, Response, g
from anylog.api.models import User
from sqlalchemy import or_

def check_auth(username_email_or_token, password):
    """
    Check if user is authenticated.
    Injects user into g object.
    """
    #Check if valid token
    user = User.verify_auth_token(username_email_or_token)

    if user and not user.active:
        return False
    elif not user:
        #check if valid username/email and password combination
        user = User.query.filter(or_(
            User.username == username_email_or_token,
            User.email == username_email_or_token
        )).first()
        if (not user) or (not user.verify_password(password)) or\
            (not user.active):
            return False

    g.user = user
    return True

def authenticate():
    """
    Sends a 401 response that enables basic auth
    """
    return Response(
    'Could not verify your access level for that URL.\n'
    'You have to login with proper credentials', 401,
    {'WWW-Authenticate': 'Basic realm="Login Required"'})

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated