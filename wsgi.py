import os

os.environ['ANYLOG_SETTINGS'] = './config/prod.cfg'

from anylog import app

if __name__ == "__main__":
    app.config['DEBUG'] = False
    app.run(debug=False)
