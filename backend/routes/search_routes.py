# routes/search_routes.py
from flask import Blueprint, request, jsonify
from models.search_model import search_auctions

search_bp = Blueprint('search', __name__)

@search_bp.route('/api/search', methods=['GET'])
def search():
    """
    API endpoint to search auctions by title or description.
    """
    # Get the search query from the request parameters
    query = request.args.get('q', '').strip()

    if not query:
        return jsonify({'message': 'Pretraga je prazna.'}), 400

    # Call the model function to fetch search results
    base_url = request.host_url
    auctions = search_auctions(query, base_url)

    if auctions is not None:
        return jsonify({'auctions': auctions}), 200
    else:
        return jsonify({'message': 'Došlo je do greške na serveru.'}), 500