# routes/auction_routes.py
from flask import Blueprint, request, jsonify
from datetime import datetime, timezone 
from models.auction_model import create_auction, get_all_auctions, delete_auction, get_auction_details, get_all_categories, get_auctions_by_category

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
    
    # Convert end_date to UTC
    try:
        local_end_date = datetime.fromisoformat(end_date)  # Parse the input date
        utc_end_date = local_end_date.astimezone(timezone.utc)  # Convert to UTC
    except ValueError:
        return jsonify({'message': 'Neispravan format datuma.'}), 400

    auction_id = create_auction(title, description, starting_price, utc_end_date.strftime('%Y-%m-%d %H:%M:%S'), category_id, files, main_image_index)
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
    
@auction_bp.route('/api/auctions/category/<string:category_name>', methods=['GET'])
def get_auctions_by_category_route(category_name):
    """
    API endpoint to fetch auctions for a specific category.
    """
    base_url = request.host_url
    auctions = get_auctions_by_category(category_name, base_url)

    if auctions is not None:
        return jsonify({'auctions': auctions}), 200  # Always return 200 OK, even if auctions is an empty list
    else:  # If there was an error fetching data
        return jsonify({'message': 'Došlo je do greške na serveru.'}), 500