from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db
from routes import routes
from config import Config
from db_init import init_db

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
app.config.from_object(Config)

db.init_app(app)
JWTManager(app)

app.register_blueprint(routes)

init_db(app)

if __name__ == '__main__':
    app.run(debug=True)
