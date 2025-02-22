# app.py
from flask import Flask
from flask_cors import CORS
from config import UPLOAD_FOLDER
from routes.auth_routes import auth_bp
from routes.auction_routes import auction_bp
from routes.bids_routes import bid_bp

app = Flask(__name__)
CORS(app)

# Configure upload folder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(auction_bp)
app.register_blueprint(bid_bp)


if __name__ == '__main__':
    app.run(debug=True, port=5000)