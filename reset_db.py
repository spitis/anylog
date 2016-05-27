import anylog as al
import sqlalchemy as sa
from sqlalchemy import create_engine, MetaData, func
from sqlalchemy import Table, Column
from sqlalchemy import Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import JSONB, ARRAY

def clean_db(testing=True):
    if testing:
        al.app.config['DB_NAME'] = 'anylog_test'

    engine = al.create_engine()
    metadata = MetaData(bind=engine)
    metadata.reflect()
    metadata.drop_all(engine)

def init_db(testing=True):
    if testing:
        al.app.config['DB_NAME'] = 'anylog_test'

    engine = al.create_engine()
    metadata = MetaData()

    user_table = Table('users', metadata,
        Column('id', Integer, primary_key=True),
        Column('username', String, nullable=False, unique=True),
        Column('password', String, nullable=False),
        Column('active', Boolean, default=True, server_default=sa.sql.expression.true())
    )

    log_table = Table('logs', metadata,
        Column('id', Integer, primary_key=True),
        Column('timestamp', DateTime(timezone=True), server_default=func.now()),
        Column('namespace', String, nullable=False),
        Column('event_name', String, nullable=False),
        Column('event_tags', ARRAY(String)),
        Column('event_json', JSONB),
        Column('user_id', Integer, ForeignKey('users.id', onupdate="CASCADE", ondelete="CASCADE"), nullable=False)
    )

    metadata.create_all(engine)

if __name__ == "__main__":
    clean_db(testing = False)
    init_db(testing = False)
