# models/user_model.py
from utils.db import get_db_connection
import bcrypt

def register_user(username, email, password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute(
                'INSERT INTO users (username, email, password_hash, role, created_at) VALUES (%s, %s, %s, %s, NOW())',
                (username, email, hashed_password.decode('utf-8'), 'user')
            )
            connection.commit()
            cursor.execute('SELECT id, username, email, role FROM users WHERE email = %s', (email,))
            user = cursor.fetchone()
            return user
        finally:
            cursor.close()
            connection.close()

def login_user(email, password):
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
            user = cursor.fetchone()
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                return user
            return None
        finally:
            cursor.close()
            connection.close()

def get_user_profile(email):
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            # Fetch the user's profile
            cursor.execute('SELECT id, username, email, role FROM users WHERE email = %s', (email,))
            user = cursor.fetchone()
            return user
        finally:
            cursor.close()
            connection.close()
    return None