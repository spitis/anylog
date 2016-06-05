# -*- coding: utf-8 -*-
"""

    Anylog API
    v0.2
    ~~~~~~~~~~
    Provides a simple REST api for logging events by user.

"""

from flask import Flask, render_template
from flask_cors import CORS
import sqlalchemy as sa
from sqlalchemy.engine.url import URL

from api.v0_2.api import api
from api.models import db

"""

    APP CONFIG

"""

app = Flask(__name__)
CORS(app)

app.config.update(dict(
    DEBUG=True,
    SECRET_KEY='development key',

    DB_DRIVER='postgresql',
    DB_HOST='localhost',
    DB_PORT='5432',
    DB_USER='postgres',
    DB_PASS='alpha',
    DB_NAME='anylog',

    SQLALCHEMY_TRACK_MODIFICATIONS=False
))

app.config['SQLALCHEMY_DATABASE_URI'] = \
    URL(
        drivername=app.config['DB_DRIVER'],
        host=app.config['DB_HOST'],
        port=app.config['DB_PORT'],
        username=app.config['DB_USER'],
        password=app.config['DB_PASS'],
        database=app.config['DB_NAME']
    )

app.config.from_envvar('ANYLOG_SETTINGS', silent=True)

db.init_app(app)

"""

    APP SETUP AND STARTUP

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

def reset_db(testing=True):
    """
    Drops and recreates all tables in DB
    """
    if testing:
        app.config['DB_NAME'] = 'anylog_test'
    with app.app_context():
        db.drop_all()
        db.create_all()

"""

    REGISTER BLUEPRINTS

"""

app.register_blueprint(api, url_prefix='/api/v0.2')

"""

    APP LAUNCH

"""

@app.route('/')
def indexRoute():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(port=3334, debug=app.config['DEBUG'])
