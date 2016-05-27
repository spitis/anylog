import anylog
import reset_db
import unittest
import time, datetime
import sqlalchemy as sa

class AnylogDBMethodsTestCase(unittest.TestCase):

    def setUp(self):
        anylog.app.config['DB_NAME'] = 'anylog_test'
        anylog.app.config['TESTING'] = True
        self.app = anylog.app.test_client()
        reset_db.clean_db(testing = True)
        reset_db.init_db(testing = True)

        anylog.connect_db()
        self.engine = anylog.create_engine()
        self.metadata = sa.MetaData(bind=self.engine)
        self.metadata.reflect()

    def tearDown(self):
        pass

    def user_exists(self, username):
        user_table = self.metadata.tables['users']

        user = self.engine.execute(
            user_table.select().where(user_table.c.username == username)
        ).fetchone()

        return bool(user) and (user['username'] == username)

    def test_correct_setup(self):
        assert(self.metadata.tables['users'] is not None)
        assert(self.metadata.tables['logs'] is not None)

    def test_insert_user(self):
        anylog.insert_user('test_user','test_pass')

        assert(self.user_exists('test_user'))

        try:
            anylog.insert_user('123','test_pass')
        except:
            pass

        assert(not self.user_exists('123'))

        try:
            anylog.insert_user('test_user_2','1234567')
        except:
            pass

        assert(not self.user_exists('test_user_2'))

        anylog.hard_delete_user(username='test_user')

    def test_cannot_insert_existing_username(self):
        anylog.insert_user('test_user','test_pass')

        try:
            anylog.insert_user('test_user','test_pass')
        except Exception:
            pass

        user_table = self.metadata.tables['users']

        user = self.engine.execute(
            user_table.select().where(user_table.c.username == 'test_user')
        )

        assert(len(user.fetchall()) == 1)

        anylog.hard_delete_user(username='test_user')

    def test_soft_delete_user(self):
        user_id = anylog.insert_user('test_user','test_pass')

        user_table = self.metadata.tables['users']

        active = self.engine.execute(
            user_table.select().where(user_table.c.id == user_id)
        ).fetchone()['active']

        assert(active)

        anylog.soft_delete_user(username='test_user',password='test_pass')

        active = self.engine.execute(
            user_table.select().where(user_table.c.id == user_id)
        ).fetchone()['active']

        assert(not active)

        pw1 = self.engine.execute(
            user_table.select().where(user_table.c.username == "test_user")
        ).fetchone()['password']

        try:
            anylog.change_password(
                new_password='test_pass_2',
                username='test_user',
                password='test_pass'
            )
        except:
            pass

        pw2 = self.engine.execute(
            user_table.select().where(user_table.c.username == "test_user")
        ).fetchone()['password']

        assert(pw1 == pw2)

        anylog.hard_delete_user(username='test_user')


    def test_cannot_soft_delete_user_without_password(self):
        user_id = anylog.insert_user('test_user','test_pass')

        user_table = self.metadata.tables['users']

        try:
            anylog.soft_delete_user(username='test_user',password='wrong_pass')
            anylog.soft_delete_user(username='test_user')
        except:
            pass

        active = self.engine.execute(
            user_table.select().where(user_table.c.id == user_id)
        ).fetchone()['active']

        assert(active)

        anylog.hard_delete_user(username='test_user')

    def test_hard_delete_user(self):
        anylog.insert_user('test_user','test_pass')

        anylog.hard_delete_user(username='test_user')

        assert(not self.user_exists('test_user'))

    def test_change_password(self):
        anylog.insert_user('test_user','test_pass')

        user_table = self.metadata.tables['users']

        user = self.engine.execute(
            user_table.select().where(user_table.c.username == "test_user")
        ).fetchone()

        pw_hash_1 = user['password']

        anylog.change_password(
            new_password='test_pass_2',
            username='test_user',
            password='test_pass'
        )

        user = self.engine.execute(
            user_table.select().where(user_table.c.username == "test_user")
        ).fetchone()

        pw_hash_2 = user['password']

        assert(pw_hash_1 != pw_hash_2)

        anylog.hard_delete_user(username='test_user')


    def test_inserted_username_min_length_4(self):
        try:
            anylog.insert_user('123','test_pass')
        except:
            pass

        assert(not self.user_exists('123'))

    def test_inserted_password_min_length_8(self):
        try:
            anylog.insert_user("test_user","1234567")
        except:
            pass

        assert(not self.user_exists('test_user'))

    def test_changed_password_must_have_length_8(self):
        anylog.insert_user("test_user","test_pass")

        user_table = self.metadata.tables['users']

        user = self.engine.execute(
            user_table.select().where(user_table.c.username == "test_user")
        ).fetchone()

        pw_hash_1 = user['password']

        try:
            anylog.change_password("1234567", username="test_user", password="test_pass")
        except:
            pass

        user = self.engine.execute(
            user_table.select().where(user_table.c.username == "test_user")
        ).fetchone()

        pw_hash_2 = user['password']

        assert(pw_hash_1 == pw_hash_2)

        anylog.hard_delete_user(username='test_user')

    def test_log_event(self):
        user_id = anylog.insert_user("test_user","test_pass")

        anylog.log_event(
            "Random",
            username="test_user",
            password="test_pass"
        )

        time.sleep(0.1)

        anylog.log_event(
            "Random",
            username="test_user",
            password="test_pass"
        )

        logs = self.metadata.tables['logs']

        events = self.engine.execute(
            logs.select()
        ).fetchall()
        assert(len(events) == 2)

        event = self.engine.execute(
            logs.select()
        ).fetchone()

        assert(type(event['timestamp']) == type(datetime.datetime.utcnow()))
        assert(event['user_id'] == user_id)
        assert(event['namespace'] == "Custom")
        assert(event['event_name'] == "Random")
        assert(event['event_tags'] == [])
        assert(event['event_json'] is None)

        anylog.hard_delete_user(username='test_user')

if __name__ == '__main__':
    unittest.main()
