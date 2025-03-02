# routes/user_routes.py
from flask import Blueprint, request, jsonify, session
from models.user_model import register_user, login_user, get_user_profile, check_auth_status

user_bp = Blueprint('auth', __name__)

@user_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'Svi podaci su obavezni.'}), 400

    user = register_user(username, email, password)
    if user:
        # Store user data in the session
        session['user_id'] = user['id']
        session['username'] = user['username']
        session['email'] = user['email']
        session['role'] = user['role']
        
        return jsonify({
            'message': 'Korisnik uspješno registrovan.',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'role': user['role']
            }
        }), 201
    return jsonify({'message': 'Email već postoji.'}), 400

@user_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email i lozinka su obavezni.'}), 400

    user = login_user(email, password)
    if user:
        # Store user data in the session
        session['user_id'] = user['id']
        session['username'] = user['username']
        session['email'] = user['email']
        session['role'] = user['role']

        return jsonify({
            'message': 'Uspješna prijava.',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200
    return jsonify({'message': 'Pogrešna lozinka ili korisnik ne postoji.'}), 401

@user_bp.route('/api/profile', methods=['GET', 'POST'])
def get_profile():
    try:
        # Get the user's email from the request body
        data = request.json
        email = data.get('email')

        # Validate input
        if not email:
            return jsonify({'message': 'Email je obavezan.'}), 400

        # Fetch the user's profile from the database
        user = get_user_profile(email)

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
    except Exception as e:
        print(f"Error fetching profile: {e}")
        return jsonify({'message': 'Došlo je do greške na serveru.'}), 500

@user_bp.route('/api/check-auth', methods=['GET'])
def check_auth():
    user_data = check_auth_status(session)
    if user_data:
        return jsonify({
            'authenticated': True,
            'user': user_data
        }), 200
    return jsonify({'authenticated': False}), 401

@user_bp.route('/api/logout', methods=['POST'])
def logout():
    session.clear()  # Clear all session data
    return jsonify({'message': 'Uspješno odjavljeni.'}), 200
