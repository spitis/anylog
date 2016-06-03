from functools import wraps
from flask import request, Response, g
from api.models import User

def check_auth(username, password):
    """
    This function is called to check if a username /
    password combination is valid.
    Injects user into g object.
    """
    user = User.query.filter_by(username=username).first()
    if (not user) or (not user.verify_password(password)) or (not user.active):
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
