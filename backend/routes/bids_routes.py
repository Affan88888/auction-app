# routes/bids_routes.py
from flask import Blueprint, request, jsonify
from models.bids_model import place_bid

bid_bp = Blueprint('bid', __name__)

@bid_bp.route('/api/place-bid', methods=['POST'])
def place_bid_route():
    """
    Endpoint to place a bid on an auction.
    """
    try:
        # Get data from request
        data = request.json
        auction_id = data.get('auction_id')
        user_id = data.get('user_id')  # Assuming the user is authenticated
        bid_amount = data.get('bid_amount')

        # Validate input
        if not auction_id or not user_id or not bid_amount:
            return jsonify({'message': 'Svi podaci su obavezni.'}), 400

        # Call the model function to place the bid
        result, status_code = place_bid(auction_id, user_id, bid_amount)

        return jsonify(result), status_code

    except Exception as e:
        print(f"Error placing bid: {e}")
        return jsonify({'message': 'Došlo je do greške na serveru.'}), 500