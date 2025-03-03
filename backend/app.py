# app.py
from flask import Flask
from flask_cors import CORS
from config import UPLOAD_FOLDER, SECRET_KEY
from routes.user_routes import user_bp
from routes.auction_routes import auction_bp
from routes.bids_routes import bid_bp
from routes.categories_routes import categories_bp
from routes.search_routes import search_bp

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configure secret key for session management
app.secret_key = SECRET_KEY

# Configure session cookie attributes
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True for HTTPS (False for localhost)
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent JavaScript access to the cookie
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Allow cookies to be sent with cross-site requests

# Configure upload folder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Register blueprints
app.register_blueprint(user_bp)
app.register_blueprint(auction_bp)
app.register_blueprint(bid_bp)
app.register_blueprint(categories_bp)
app.register_blueprint(search_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)