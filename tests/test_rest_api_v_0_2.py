from flask import Flask
import unittest
import json
import base64

API_PREFIX = '/api/v0.2'

import sqlalchemy as sa
from anylog import app, db
from api.models import User

class Anylog_REST_API_Test_Case(unittest.TestCase):

    def setUp(self):
        app.config['DB_NAME'] = 'anylog_test'
        app.config['TESTING'] = True

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
            method='POST',
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
            method='POST',
            username=user.username,
            password="password",
            data = json.dumps(dict(
                username="test",
                email="test2@test2.com",
                password="password"
            ))
        )

        assert(res.status_code == 200)
        assert(User.query.first().email == "test2@test2.com")

        user = User.query.first()
        pw_orig = user.password
        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='POST',
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
            method='POST',
            username=user.username,
            password="password",
            data = json.dumps(dict(
                username="test",
                password="password"
            ))
        )

        assert(res.status_code != 200)

        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='POST',
            username=user.username,
            password="PASSWORD",
            data = json.dumps(dict(
                username="testtest"
            ))
        )

        assert(res.status_code == 200)
        assert(User.query.first().username == "testtest")

        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='POST',
            username=user.username,
            password="PASSWORD",
            data = json.dumps(dict(
                active=False
            ))
        )

        assert(res.status_code == 200)

        user = User.query.first()
        res = self.open_with_auth(
            url= API_PREFIX + '/user/' + user.username,
            method='POST',
            username=user.username,
            password="PASSWORD",
            data = json.dumps(dict(
                username="testtest"
            ))
        )

        assert(res.status_code != 200)

if __name__ == '__main__':
    unittest.main()
