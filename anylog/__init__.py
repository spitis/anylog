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
from flask_mail import Mail
import sqlalchemy as sa
from sqlalchemy.engine.url import URL

from .api.v0_2.api import api
from .api.models import db

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
mail = Mail(app)

"""

    REGISTER BLUEPRINTS

"""

app.register_blueprint(api, url_prefix='/api/v0.2')

"""

    APP LAUNCH

"""

from flask_mail import Message
@app.route('/mailtosilviu')
def mailtosilviu(mailto= ['silviu.pitis@gmail.com'], mailfrom=app.config['MAIL_DEFAULT_SENDER']):
    requests.post(
        app.config['MAILGUN_BASE_URL']+"/messages",
        auth=("api", app.config['MAILGUN_API_KEY']),
        data={"from": mailfrom,
              "to": mailto,
              "subject": "Hello",
              "text": "Testing some Mailgun awesomness!"})
    return 'OK', 200

@app.route('/')
@app.route('/<path:path>')
def indexRoute(path=None):
    return render_template('index.html')

if __name__ == "__main__":
    app.run(port=3334, debug=app.config['DEBUG'])
