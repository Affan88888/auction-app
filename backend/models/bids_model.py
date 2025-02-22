# models/bids_model.py
from utils.db import get_db_connection
from datetime import datetime

def place_bid(auction_id, user_id, bid_amount):
    """
    Place a new bid on an auction.
    """
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            # Fetch auction details
            cursor.execute('SELECT starting_price, end_date FROM auctions WHERE id = %s', (auction_id,))
            auction = cursor.fetchone()

            if not auction:
                return {'error': 'Aukcija nije pronađena.'}, 404

            current_time = datetime.now()
            if current_time > auction['end_date']:
                return {'error': 'Aukcija je završila.'}, 400

            # Fetch the highest bid for the auction
            cursor.execute('SELECT MAX(amount) AS highest_bid FROM bids WHERE auction_id = %s', (auction_id,))
            highest_bid = cursor.fetchone()['highest_bid'] or auction['starting_price']

            # Calculate the minimum required bid
            min_bid_increment = 5  # Example: $5 increment
            min_required_bid = highest_bid + min_bid_increment

            if bid_amount < min_required_bid:
                return {
                    'error': f'Minimalna ponuda je ${min_required_bid:.2f}.'
                }, 400

            # Insert the new bid
            cursor.execute(
                'INSERT INTO bids (auction_id, user_id, amount, created_at) VALUES (%s, %s, %s, NOW())',
                (auction_id, user_id, bid_amount)
            )
            connection.commit()

            return {'message': 'Ponuda uspješno postavljena.', 'new_highest_bid': bid_amount}, 201

        except Exception as e:
            print(f"Database error: {e}")
            return {'error': 'Došlo je do greške na serveru.'}, 500

        finally:
            cursor.close()
            connection.close()