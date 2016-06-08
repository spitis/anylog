import anylog

from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

migrate = Migrate(anylog.app, anylog.db)
manager = Manager(anylog.app)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
