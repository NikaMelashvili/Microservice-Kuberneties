from flask import Flask
from flask_jwt_extended import JWTManager
from models import db
from routes import routes
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
JWTManager(app)

app.register_blueprint(routes)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
