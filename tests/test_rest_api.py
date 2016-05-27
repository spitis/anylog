import anylog
import reset_db
import unittest
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

    def test_something(self):
        #TODO
        assert(False)

if __name__ == '__main__':
    unittest.main()
