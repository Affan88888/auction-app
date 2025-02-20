# models/auction_model.py
from utils.db import get_db_connection
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
import os

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_auction(title, description, starting_price, end_date, files, main_image_index=None):
    image_urls = []
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            image_urls.append(file_path)

    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            # Insert the auction into the database
            cursor.execute(
                'INSERT INTO auctions (title, description, starting_price, end_date, main_image_url, created_at) VALUES (%s, %s, %s, %s, %s, NOW())',
                (title, description, starting_price, end_date, image_urls[main_image_index] if main_image_index is not None else None)
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
            cursor.execute('''
                SELECT a.id, a.title, a.description, a.starting_price, a.end_date, a.main_image_url,
                       GROUP_CONCAT(ai.image_url) AS images
                FROM auctions a
                LEFT JOIN auction_images ai ON a.id = ai.auction_id
                GROUP BY a.id
            ''')
            auctions = cursor.fetchall()
            for auction in auctions:
                auction['images'] = [f"{base_url}{img}" for img in auction['images'].split(',')] if auction['images'] else []
                auction['main_image_url'] = f"{base_url}{auction['main_image_url']}" if auction['main_image_url'] else None
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

def get_auction_details(auction_id, base_url):
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute('''
                SELECT a.id, a.title, a.description, a.starting_price, a.end_date, a.main_image_url,
                       GROUP_CONCAT(ai.image_url) AS images
                FROM auctions a
                LEFT JOIN auction_images ai ON a.id = ai.auction_id
                WHERE a.id = %s
                GROUP BY a.id
            ''', (auction_id,))
            auction = cursor.fetchone()
            if auction:
                auction['images'] = auction['images'].split(',') if auction['images'] else []
                auction['images'] = [f"{base_url}{img}" for img in auction['images']]
                auction['main_image_url'] = f"{base_url}{auction['main_image_url']}" if auction['main_image_url'] else None
                return auction
            return None
        finally:
            cursor.close()
            connection.close()