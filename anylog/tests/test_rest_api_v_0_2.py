from flask import Flask
import unittest
import json
import base64
from sqlalchemy.engine.url import URL

API_PREFIX = '/api/v0.2'

import sqlalchemy as sa
from anylog import app, db
from anylog.api.models import User, Log

class Anylog_REST_API_Test_Case(unittest.TestCase):

    def setUp(self):
        app.config['DB_NAME'] = 'anylog_test'
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = \
            URL(
                drivername=app.config['DB_DRIVER'],
                host=app.config['DB_HOST'],
                port=app.config['DB_PORT'],
                username=app.config['DB_USER'],
                password=app.config['DB_PASS'],
                database=app.config['DB_NAME']
            )

        self.client = app.test_client()
        db.app = app

        db.session.close_all()
        db.drop_all()
        db.create_all()

        testuser = User(username="test",\
            email="test@test.com", password="password")

        db.session.add(testuser)
        db.session.commit()

    def tearDown(self):
        pass

    def open_with_auth(self, url, method, username, password, data):
        return self.client.open(url,
            method=method,
            headers={
                'Authorization': 'Basic ' + base64.b64encode(bytes(username +\
                 ":" + password, 'ascii')).decode('ascii')
            },
            data=data
        )

    def test_insert_user(self):
        assert(len(User.query.all()) == 1)

        self.client.post(API_PREFIX + '/user',
            data = json.dumps(dict(
                username="test2",
                email="test2@test2.com",
                password="password"
            )),
            content_type = 'application/json')

        assert(len(User.query.all()) == 2)

        self.client.post(API_PREFIX + '/user',
            data = json.dumps(dict(
                username="test2",
                email="test3@test3.com",
                password="password"
            )),
            content_type = 'application/json')

        assert(len(User.query.all()) == 2)

        self.client.post(API_PREFIX + '/user',
            data = json.dumps(dict(
                username="test3",
                email="test2@test2.com",
                password="password"
            )),
            content_type = 'application/json')

        assert(len(User.query.all()) == 2)

        self.client.post(API_PREFIX + '/user',
            data = json.dumps(dict(
                username="test3",
                email="test3@test3.com",
                password="pass"
            )),
            content_type = 'application/json')

        assert(len(User.query.all()) == 2)

        self.client.post(API_PREFIX + '/user',
            data = json.dumps(dict(
                username="tst",
                email="test3@test3.com",
                password="password"
            )),
            content_type = 'application/json')

        assert(len(User.query.all()) == 2)

        self.client.post(API_PREFIX + '/user',
            data = json.dumps(dict(
                username="test",
                email="garbage",
                password="password"
            )),
            content_type = 'application/json')

        assert(len(User.query.all()) == 2)

        self.client.post(API_PREFIX + '/user',
            data = json.dumps(dict(
                username="test",
                password="password"
            )),
            content_type = 'application/json')

        assert(len(User.query.all()) == 2)

    def test_modify_user(self):
        user = User.query.first()

        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='PUT',
            username=user.username,
            password="password",
            data = json.dumps(dict(
                username="test",
                email="test@test.com",
                password="password"
            ))
        )

        assert(res.status_code == 200)

        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='PUT',
            username=user.username,
            password="password",
            data = json.dumps(dict(
                username="test",
                email="test2@test2.com",
                password="password",
                sms_number = 3233234444
            ))
        )

        assert(res.status_code == 200)
        assert(User.query.first().email == "test2@test2.com")
        assert(User.query.first().sms_number == 3233234444)

        user = User.query.first()
        pw_orig = user.password
        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='PUT',
            username=user.username,
            password="password",
            data = json.dumps(dict(
                username="test",
                password="PASSWORD"
            ))
        )
        user = User.query.first()
        assert(res.status_code == 200)
        assert(pw_orig != user.password)

        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='PUT',
            username=user.username,
            password="password",
            data = json.dumps(dict(
                username="test",
                password="password"
            ))
        )

        assert(res.status_code != 200)

        #change password back
        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='PUT',
            username=user.username,
            password="PASSWORD",
            data = json.dumps(dict(
                username="test",
                password="password"
            ))
        )

        #Try to modify different user fails
        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/user/wrongusername',
            method='PUT',
            username=user.username,
            password="password",
            data = json.dumps(dict(
                username="test",
                password="password"
            ))
        )

        assert(res.status_code == 401)

        #Invalid JSON fails
        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='PUT',
            username=user.username,
            password="password",
            data = "{this_is_not_json: 'nope}"
        )

        assert(res.status_code == 400)

        #Improper JSON fails (i.e. does not fit user schema)

        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='PUT',
            username=user.username,
            password="password",
            data = json.dumps(dict(
                username="test",
                password="pass"
            ))
        )

        assert(res.status_code == 400)

        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='PUT',
            username=user.username,
            password="password",
            data = json.dumps(dict(
                username="testtest"
            ))
        )

        assert(res.status_code == 200)
        assert(User.query.first().username == "testtest")

        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='PUT',
            username=user.username,
            password="password",
            data = json.dumps(dict(
                active=False
            ))
        )

        assert(res.status_code == 200)

        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='PUT',
            username=user.username,
            password="password",
            data = json.dumps(dict(
                username="testtest"
            ))
        )

        assert(res.status_code != 200)

    def test_login(self):
        user = User.query.first()

        res = self.open_with_auth(
            url= API_PREFIX + '/login',
            method='GET',
            username=user.username,
            password="password",
            data=None
        )

        resJson = json.loads(res.data.decode('utf-8'))
        assert(res.status_code == 200)
        assert(resJson['token'])
        assert(resJson['username'] == user.username)

    def test_post_logs_URL(self):
        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/logs?event_name=random_event',
            method='POST',
            username=user.username,
            password="password",
            data=None
        )

        log = Log.query.first()

        assert(log.event_name == 'random_event')

        db.session.delete(log)
        db.session.commit()


        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/logs?event_name=random&event_tags=a,b&event_text=cooltext&namespace=custom2',
            method='POST',
            username=user.username,
            password="password",
            data=None
        )

        log = Log.query.first()

        assert('a' in log.event_tags)
        assert('b' in log.event_tags)
        assert(log.event_json.get('text') == 'cooltext')
        assert(log.namespace == 'custom2')

    def test_post_logs_JSON(self):
        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/logs',
            method='POST',
            username=user.username,
            password="password",
            data=json.dumps(dict(
                event_name="random_event"
            ))
        )

        log = Log.query.first()

        assert(log.event_name == 'random_event')

        db.session.delete(log)
        db.session.commit()


        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/logs',
            method='POST',
            username=user.username,
            password="password",
            data=json.dumps(dict(
                event_name="random",
                event_tags=["a","b"],
                event_json={"text": "cooltext"},
                namespace="custom2"
            ))
        )

        log = Log.query.first()

        assert('a' in log.event_tags)
        assert('b' in log.event_tags)
        assert(log.event_json.get('text') == 'cooltext')
        assert(log.namespace == 'custom2')

    def test_post_logs_URL_params_merge_with_JSON(self):
        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/logs?event_name=coolevent&event_text=urltext',
            method='POST',
            username=user.username,
            password="password",
            data=json.dumps(dict(
                event_tags=["a","b"],
                event_json={"text": "cooltext"},
                namespace="custom2"
            ))
        )

        log = Log.query.first()
        assert(log.event_name == 'coolevent')
        assert('a' in log.event_tags)
        assert('b' in log.event_tags)
        assert(log.event_json.get('text') == 'cooltext')
        assert(log.namespace == 'custom2')

    def test_get_logs(self):
        username = User.query.first().username

        #post two logs
        self.open_with_auth(
            url= API_PREFIX + '/logs?event_name=random_event',
            method='POST',
            username=username,
            password="password",
            data=None
        )
        self.open_with_auth(
            url= API_PREFIX + '/logs?event_name=random&event_tags=a,b&event_text=cooltext&namespace=custom2',
            method='POST',
            username=username,
            password="password",
            data=None
        )

        #test get all
        res = self.open_with_auth(
            url= API_PREFIX + '/logs',
            method='GET',
            username=username,
            password="password",
            data=None
        )
        res = json.loads(res.data.decode('utf-8'))['logs']
        assert(len(res) == 2)

        #test get one
        res = self.open_with_auth(
            url= API_PREFIX + '/logs?event_name=random',
            method='GET',
            username=username,
            password="password",
            data=None
        )
        res = json.loads(res.data.decode('utf-8'))['logs']
        assert(len(res) == 1)
        assert("a" in res[0]["event_tags"])
        assert("b" in res[0]["event_tags"])
        assert(res[0]["event_json"]["text"] == "cooltext")
        assert(res[0]["namespace"] == "custom2")

        #test get the other
        res = self.open_with_auth(
            url= API_PREFIX + '/logs?event_name=random_event',
            method='GET',
            username=username,
            password="password",
            data=None
        )
        res = json.loads(res.data.decode('utf-8'))['logs']
        assert(len(res) == 1)
        assert(res[0]["event_name"] == "random_event")

    def test_post_logs_requires_auth(self):
        username = User.query.first().username
        res = self.open_with_auth(
            url= API_PREFIX + '/logs?event_name=random_event',
            method='POST',
            username=username,
            password="password2",
            data=None
        )
        assert(res.status_code == 401)

    def test_get_logs_requires_auth(self):
        username = User.query.first().username
        res = self.open_with_auth(
            url= API_PREFIX + '/logs',
            method='GET',
            username=username,
            password="password2",
            data=None
        )
        assert(res.status_code == 401)

    def test_delete_log(self):
        user = User.query.first()
        log = Log(user=user, event_name="testlog")
        db.session.add(log)
        db.session.commit()

        assert(len(Log.query.all()) == 1)

        res = self.open_with_auth(
            url= API_PREFIX + '/log/' + str(log.id),
            method='DELETE',
            username=user.username,
            password="password",
            data=None
        )

        assert(len(Log.query.all()) == 0)

    def test_update_log(self):
        user = User.query.first()
        log = Log(user=user, event_name="testlog")
        db.session.add(log)
        db.session.commit()

        assert(Log.query.first().event_name == "testlog")

        res = self.open_with_auth(
            url= API_PREFIX + '/log/' + str(log.id),
            method='PUT',
            username=user.username,
            password="password",
            data=json.dumps(dict(
                event_name="test2",
                event_tags=['a','b'],
                event_json={"text": "cooltext"},
                namespace="custom2"
            ))
        )

        log = Log.query.first()

        assert(log.event_name == "test2")
        assert('a' in log.event_tags)
        assert('b' in log.event_tags)
        assert(log.event_json['text'] == "cooltext")
        assert(log.namespace == 'custom2')

    def test_cannot_get_or_update_another_users_logs(self):
        user = User.query.first()
        user2 = User(username="test2",\
            email="test2@test.com", password="password2")

        db.session.add(user2)
        db.session.commit()

        log = Log(user=user2, event_name="testlog")
        db.session.add(log)
        db.session.commit()

        #test cannot update
        res = self.open_with_auth(
            url= API_PREFIX + '/log/' + str(log.id),
            method='PUT',
            username=user.username,
            password="password",
            data=json.dumps(dict(
                event_name="test2"
            ))
        )

        assert(res.status_code == 401)

        #test cannot get
        res = self.open_with_auth(
            url= API_PREFIX + '/logs',
            method='GET',
            username=user.username,
            password="password",
            data=None
        )
        resJson = json.loads(res.data.decode('utf-8'))

        assert(len(resJson['logs']) == 0)

    def test_can_generate_api_key(self):
        user = User.query.first()

        assert(user.api_key is None)

        res = self.open_with_auth(
            url= API_PREFIX + '/user/generate_api_key',
            method='GET',
            username=user.username,
            password="password",
            data=None
        )

        user = User.query.first()

        assert(user.api_key is not None)

if __name__ == '__main__':
    unittest.main()
