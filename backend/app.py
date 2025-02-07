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
        cursor = connection.cursor()

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

        # Close the database connection
        cursor.close()
        connection.close()

        return jsonify({'message': 'Korisnik uspješno registrovan.'}), 201

    except Error as e:
        print(f"Database error: {e}")
        return jsonify({'message': 'Došlo je do greške na serveru.'}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5000)