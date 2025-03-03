# routes/categories_routes.py
from flask import Blueprint, request, jsonify
from models.categories_model import get_all_categories, get_auctions_by_category

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/api/categories', methods=['GET'])
def get_categories():
    categories = get_all_categories()
    if categories is not None:
        return jsonify({'categories': categories}), 200
    else:
        return jsonify({'message': 'Došlo je do greške na serveru.'}), 500
    
@categories_bp.route('/api/auctions/category/<string:category_name>', methods=['GET'])
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