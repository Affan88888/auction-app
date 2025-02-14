# backend/app.py
from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
import bcrypt  
from flask_cors import CORS 
from dotenv import load_dotenv
import os
from werkzeug.utils import secure_filename

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app) 

# Database connection configuration
db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'your_database_name')
}

@app.route('/api/register', methods=['POST'])
def register():
    try:
        # Get data from request
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Validate input
        if not username or not email or not password:
            return jsonify({'message': 'Svi podaci su obavezni.'}), 400

        # Hash the password using bcrypt
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Connect to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Check if the email already exists
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({'message': 'Email već postoji.'}), 400

        # Insert the user into the database
        cursor.execute(
            'INSERT INTO users (username, email, password_hash, role, created_at) VALUES (%s, %s, %s, %s, NOW())',
            (username, email, hashed_password.decode('utf-8'), 'user')
        )
        connection.commit()

        # Fetch the newly created user
        cursor.execute('SELECT id, username, email, role FROM users WHERE email = %s', (email,))
        new_user = cursor.fetchone()

        # Close the database connection
        cursor.close()
        connection.close()

        # Return the new user details
        return jsonify({
            'message': 'Korisnik uspješno registrovan.',
            'user': {
                'id': new_user['id'],
                'username': new_user['username'],
                'email': new_user['email'],
                'role': new_user['role']
            }
        }), 201

    except Error as e:
        print(f"Database error: {e}")
        return jsonify({'message': 'Došlo je do greške na serveru.'}), 500
    
@app.route('/api/login', methods=['POST'])
def login():
    try:
        # Get data from request
        data = request.json
        email = data.get('email')
        password = data.get('password')

        # Validate input
        if not email or not password:
            return jsonify({'message': 'Email i lozinka su obavezni.'}), 400

        # Connect to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Check if the user exists
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'message': 'Korisnik ne postoji.'}), 401

        # Verify the password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({'message': 'Pogrešna lozinka.'}), 401

        # Login successful
        return jsonify({
            'message': 'Uspješna prijava.',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200

    except Error as e:
        print(f"Database error: {e}")
        return jsonify({'message': 'Došlo je do greške na serveru.'}), 500

    finally:
        cursor.close()
        connection.close()

@app.route('/api/profile', methods=['GET', 'POST'])
def get_profile():
    try:
        # Get the user's email from the request headers or body (if using tokens)
        # For simplicity, we'll assume the frontend sends the email in the request body
        data = request.json
        email = data.get('email')

        # Validate input
        if not email:
            return jsonify({'message': 'Email je obavezan.'}), 400

        # Connect to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Fetch the user's profile
        cursor.execute('SELECT id, username, email, role FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()

        # Close the database connection
        cursor.close()
        connection.close()

        if not user:
            return jsonify({'message': 'Korisnik ne postoji.'}), 404

        # Return the user's profile
        return jsonify({
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200

    except Error as e:
        print(f"Database error: {e}")
        return jsonify({'message': 'Došlo je do greške na serveru.'}), 500
    
# Configure file upload settings
UPLOAD_FOLDER = 'static/uploads'  # Directory to store uploaded images
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS    
    
@app.route('/api/create-auction', methods=['POST'])
def create_auction():
    try:
        # Get data from request
        data = request.form
        title = data.get('title')
        description = data.get('description')
        starting_price = data.get('startingPrice')
        end_date = data.get('endDate')

        # Validate input
        if not title or not description or not starting_price or not end_date:
            return jsonify({'message': 'Svi podaci su obavezni.'}), 400

        # Handle file uploads
        files = request.files.getlist('images')  # Get list of uploaded files
        image_urls = []

        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                image_urls.append(file_path)

        # Connect to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Insert the auction into the database
        cursor.execute(
            'INSERT INTO auctions (title, description, starting_price, end_date, created_at) VALUES (%s, %s, %s, %s, NOW())',
            (title, description, starting_price, end_date)
        )
        auction_id = cursor.lastrowid  # Get the ID of the newly created auction

        # Insert image URLs into the auction_images table
        for image_url in image_urls:
            cursor.execute(
                'INSERT INTO auction_images (auction_id, image_url) VALUES (%s, %s)',
                (auction_id, image_url)
            )

        connection.commit()

        # Close the database connection
        cursor.close()
        connection.close()

        return jsonify({'message': 'Aukcija uspješno kreirana.', 'auction_id': auction_id}), 201

    except Error as e:
        print(f"Database error: {e}")
        return jsonify({'message': 'Došlo je do greške na serveru.'}), 500
    

@app.route('/api/auctions', methods=['GET'])
def get_auctions():
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Fetch auctions and their images
        cursor.execute('''
            SELECT a.id, a.title, a.description, a.starting_price, a.end_date, GROUP_CONCAT(ai.image_url) AS images
            FROM auctions a
            LEFT JOIN auction_images ai ON a.id = ai.auction_id
            GROUP BY a.id
        ''')
        auctions = cursor.fetchall()

        # Split image URLs into arrays and prepend the base URL
        base_url = request.host_url  # Get the base URL of the server (e.g., http://localhost:5000/)
        for auction in auctions:
            auction['images'] = [f"{base_url}{img}" for img in auction['images'].split(',')] if auction['images'] else []

        cursor.close()
        connection.close()

        return jsonify({'auctions': auctions}), 200

    except Error as e:
        print(f"Database error: {e}")
        return jsonify({'message': 'Došlo je do greške na serveru.'}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5000)