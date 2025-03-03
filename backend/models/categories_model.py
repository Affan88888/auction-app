# models/categories_model.py
from utils.db import get_db_connection
from datetime import datetime, timezone

def get_all_categories():
    """
    Fetches all categories from the database.
    Returns a list of categories or None if an error occurs.
    """
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            # Fetch all categories
            cursor.execute('SELECT id, name FROM categories')
            categories = cursor.fetchall()
            return categories
        except Exception as e:
            print(f"Database error: {e}")
            return None
        finally:
            cursor.close()
            connection.close()

def get_auctions_by_category(category_name, base_url):
    """
    Fetches all auctions belonging to a specific category.
    Returns a list of auctions or None if an error occurs.
    """
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            # Fetch auctions for the specified category
            cursor.execute('''
                SELECT a.id, a.title, a.description, a.starting_price, a.end_date, a.main_image_url,
                       GROUP_CONCAT(ai.image_url) AS images
                FROM auctions a
                LEFT JOIN auction_images ai ON a.id = ai.auction_id
                LEFT JOIN categories c ON a.category_id = c.id
                WHERE c.name = %s
                GROUP BY a.id
            ''', (category_name,))
            auctions = cursor.fetchall()

            # Process each auction
            for auction in auctions:
                # Process additional images
                auction['images'] = [f"{base_url}{img}" for img in auction['images'].split(',')] if auction['images'] else []

                # Process main image URL
                if auction['main_image_url']:
                    auction['main_image_url'] = f"{base_url}{auction['main_image_url']}"

                # Fetch the highest bid for the auction
                cursor.execute('SELECT MAX(amount) AS highest_bid FROM bids WHERE auction_id = %s', (auction['id'],))
                highest_bid = cursor.fetchone()['highest_bid']
                # Add the current price (highest bid or starting price if no bids exist)
                auction['current_price'] = highest_bid or auction['starting_price']

                # Convert end_date to a timezone-aware datetime
                end_date_naive = auction['end_date']  # Naive datetime from the database
                end_date = end_date_naive.replace(tzinfo=timezone.utc)  # Make it timezone-aware

                # Check if the auction has ended (use UTC for comparison)
                now_utc = datetime.now(timezone.utc)  # Use timezone-aware UTC time
                auction['has_ended'] = now_utc > end_date  # True if the auction has ended

            return auctions if auctions else []

        except Exception as e:
            print(f"Database error: {e}")
            return None

        finally:
            cursor.close()
            connection.close()