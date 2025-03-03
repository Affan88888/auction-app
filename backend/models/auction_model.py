# models/auction_model.py
from utils.db import get_db_connection
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
import os
from datetime import datetime, timezone

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_auction(title, description, starting_price, end_date, category_id, files, main_image_index=0):
    image_urls = []
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            image_urls.append(file_path)

    # Ensure main_image_index is within bounds
    main_image_index = max(0, min(main_image_index, len(image_urls) - 1)) if image_urls else None

    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            # Insert the auction into the database
            cursor.execute(
                'INSERT INTO auctions (title, description, starting_price, end_date, category_id, main_image_url, created_at) VALUES (%s, %s, %s, %s, %s, %s, NOW())',
                (title, description, starting_price, end_date, category_id, image_urls[main_image_index] if main_image_index is not None else None)
            )
            auction_id = cursor.lastrowid

            # Insert image URLs into the auction_images table
            for image_url in image_urls:
                cursor.execute(
                    'INSERT INTO auction_images (auction_id, image_url) VALUES (%s, %s)',
                    (auction_id, image_url)
                )

            connection.commit()
            return auction_id
        finally:
            cursor.close()
            connection.close()

def get_all_auctions(base_url):
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            # Fetch all auctions and their images
            cursor.execute('''
                SELECT a.id, a.title, a.description, a.starting_price, a.end_date, a.main_image_url,
                       GROUP_CONCAT(ai.image_url) AS images
                FROM auctions a
                LEFT JOIN auction_images ai ON a.id = ai.auction_id
                GROUP BY a.id
            ''')
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

        finally:
            cursor.close()
            connection.close()

def delete_auction(auction_id):
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute('DELETE FROM auction_images WHERE auction_id = %s', (auction_id,))
            cursor.execute('DELETE FROM auctions WHERE id = %s', (auction_id,))
            connection.commit()
        finally:
            cursor.close()
            connection.close()

from datetime import datetime, timezone  # Import timezone explicitly

def get_auction_details(auction_id, base_url):
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            # Fetch auction details along with the category name
            cursor.execute('''
                SELECT a.id, a.title, a.description, a.starting_price, a.end_date, a.main_image_url,
                       GROUP_CONCAT(ai.image_url) AS images, c.name AS category_name
                FROM auctions a
                LEFT JOIN auction_images ai ON a.id = ai.auction_id
                LEFT JOIN categories c ON a.category_id = c.id
                WHERE a.id = %s
                GROUP BY a.id
            ''', (auction_id,))
            auction = cursor.fetchone()

            if auction:
                # Process image URLs
                auction['images'] = auction['images'].split(',') if auction['images'] else []
                auction['images'] = [f"{base_url}{img}" for img in auction['images']]
                
                # Process main image URL
                auction['main_image_url'] = f"{base_url}{auction['main_image_url']}" if auction['main_image_url'] else None

                # Fetch the highest bid for the auction
                cursor.execute('SELECT MAX(amount) AS highest_bid FROM bids WHERE auction_id = %s', (auction_id,))
                highest_bid = cursor.fetchone()['highest_bid']
                # Add the current price (highest bid or starting price if no bids exist)
                auction['current_price'] = highest_bid or auction['starting_price']

                # Add the category name
                auction['category_name'] = auction['category_name'] or 'Nepoznato'  # Default to 'Nepoznato' if null

                # Convert end_date to a timezone-aware datetime
                end_date_naive = auction['end_date']  # Naive datetime from the database
                end_date = end_date_naive.replace(tzinfo=timezone.utc)  # Make it timezone-aware

                # Check if the auction has ended (use UTC for comparison)
                now_utc = datetime.now(timezone.utc)  # Use timezone-aware UTC time
                auction['has_ended'] = now_utc > end_date  # True if the auction has ended

                return auction
            return None
        finally:
            cursor.close()
            connection.close()

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