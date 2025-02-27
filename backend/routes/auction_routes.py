# routes/auction_routes.py
from flask import Blueprint, request, jsonify
from models.auction_model import create_auction, get_all_auctions, delete_auction, get_auction_details, get_all_categories

auction_bp = Blueprint('auction', __name__)

@auction_bp.route('/api/create-auction', methods=['POST'])
def create():
    data = request.form
    title = data.get('title')
    description = data.get('description')
    starting_price = data.get('startingPrice')
    end_date = data.get('endDate')
    category_id = data.get('categoryId')
    files = request.files.getlist('images')

    # Get main_image_index, defaulting to 0 if not provided or invalid
    try:
        main_image_index = int(data.get('main_image_index', 0))
    except ValueError:
        main_image_index = 0

    if not title or not description or not starting_price or not end_date or not category_id:
        return jsonify({'message': 'Svi podaci su obavezni.'}), 400

    auction_id = create_auction(title, description, starting_price, end_date, category_id, files, main_image_index)
    return jsonify({'message': 'Aukcija uspješno kreirana.', 'auction_id': auction_id}), 201

@auction_bp.route('/api/auctions', methods=['GET'])
def get_auctions():
    base_url = request.host_url
    auctions = get_all_auctions(base_url)
    return jsonify({'auctions': auctions}), 200

@auction_bp.route('/api/auctions/<int:auction_id>', methods=['DELETE'])
def delete(auction_id):
    delete_auction(auction_id)
    return jsonify({'message': 'Aukcija uspješno izbrisana.'}), 200

@auction_bp.route('/api/auctions/<int:auction_id>', methods=['GET'])
def get_details(auction_id):
    base_url = request.host_url
    auction = get_auction_details(auction_id, base_url)
    if auction:
        return jsonify({'auction': auction}), 200
    return jsonify({'message': 'Aukcija nije pronađena.'}), 404

@auction_bp.route('/api/categories', methods=['GET'])
def get_categories():
    categories = get_all_categories()
    if categories is not None:
        return jsonify({'categories': categories}), 200
    else:
        return jsonify({'message': 'Došlo je do greške na serveru.'}), 500