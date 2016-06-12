# -*- coding: utf-8 -*-
"""

    Anylog API
    v0.2
    ~~~~~~~~~~
    Provides a simple REST api for logging events by user.

"""

import requests
from flask import Flask, render_template
from flask_cors import CORS
import sqlalchemy as sa
from sqlalchemy.engine.url import URL

from .api.v0_2.api import api
from .api.models import db
from .api.verification import verification
from .api.sms import sms
from .api.email import email

"""

    APP CONFIG

"""

app = Flask(__name__)

app.config.from_envvar('ANYLOG_SETTINGS')

app.config['SQLALCHEMY_DATABASE_URI'] = \
    str(URL(
        drivername=app.config['DB_DRIVER'],
        host=app.config['DB_HOST'],
        port=app.config['DB_PORT'],
        username=app.config['DB_USER'],
        password=app.config['DB_PASS'],
        database=app.config['DB_NAME']
    ))

db.init_app(app)

CORS(app)

"""

    REGISTER BLUEPRINTS

"""

app.register_blueprint(api, url_prefix='/api/v0.2')
app.register_blueprint(verification, url_prefix='/api/verify')
app.register_blueprint(sms, url_prefix='/api/sms')
app.register_blueprint(email, url_prefix='/api/email')

"""

    APP LAUNCH

"""

@app.route('/')
@app.route('/<path:path>')
def indexRoute(path=None):
    return render_template('index.html')

if __name__ == "__main__":
    app.run(port=3334, debug=app.config['DEBUG'])
