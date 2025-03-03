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
                SELECT a.id, a.title, a.description, a.starting_price, a.end_date,
                       GROUP_CONCAT(ai.image_url) AS images
                FROM auctions a
                LEFT JOIN auction_images ai ON a.id = ai.auction_id
                WHERE a.title LIKE %s OR a.description LIKE %s
                GROUP BY a.id
            ''', (f"%{query}%", f"%{query}%"))
            auctions = cursor.fetchall()

            # Process image URLs
            for auction in auctions:
                auction['images'] = [f"{base_url}{img}" for img in auction['images'].split(',')] if auction['images'] else []

            return auctions

        except Exception as e:
            print(f"Database error: {e}")
            return None

        finally:
            cursor.close()
            connection.close()