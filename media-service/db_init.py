import time
from sqlalchemy.exc import OperationalError
from models import db

def init_db(app):
    retries = 10
    while retries > 0:
        try:
            with app.app_context():
                db.create_all()
                print("Database initialized.")
                return
        except OperationalError:
            print("DB not ready, retrying...")
            time.sleep(3)
            retries -= 1

    print("Failed to connect to DB.")