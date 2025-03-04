# models/search_model.py
from utils.db import get_db_connection

def search_auctions(query, base_url):
    """
    Fetches auctions matching the search query from the database.
    Returns a list of auctions or None if an error occurs.
    """
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            # Fetch auctions where the title or description matches the query
            cursor.execute('''
                SELECT a.id, a.title, a.description, a.starting_price, a.end_date, a.main_image_url,
                       GROUP_CONCAT(ai.image_url) AS images
                FROM auctions a
                LEFT JOIN auction_images ai ON a.id = ai.auction_id
                WHERE a.title LIKE %s OR a.description LIKE %s
                GROUP BY a.id
            ''', (f"%{query}%", f"%{query}%"))
            auctions = cursor.fetchall()

            # Fetch the highest bids for all auctions in a single query
            cursor.execute('''
                SELECT auction_id, MAX(amount) AS highest_bid
                FROM bids
                GROUP BY auction_id
            ''')
            highest_bids = {row['auction_id']: row['highest_bid'] for row in cursor.fetchall()}

            # Process each auction to add image URLs, main image URL, and current price
            for auction in auctions:
                # Add image URLs
                auction['images'] = [f"{base_url}{img}" for img in auction['images'].split(',')] if auction['images'] else []

                # Add main image URL
                auction['main_image_url'] = f"{base_url}{auction['main_image_url']}" if auction['main_image_url'] else None

                # Add the current price (highest bid or starting price if no bids exist)
                auction['current_price'] = highest_bids.get(auction['id']) or auction['starting_price']

            return auctions

        except Exception as e:
            print(f"Database error: {e}")
            return None

        finally:
            cursor.close()
            connection.close()