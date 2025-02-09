# backend/app.py
from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
import bcrypt  
from flask_cors import CORS 
from dotenv import load_dotenv
import os

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

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5000)