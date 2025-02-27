import mysql.connector

db = mysql.connector.connect(
       host="localhost",
       user="user",
       passwd="passwd",
       database="database"
    )

mycursor = db.cursor()

# KOD ZA PRAVLJENJE users table-a
#create_table_query = """
#CREATE TABLE users (
#    id INT AUTO_INCREMENT PRIMARY KEY,
#    username VARCHAR(80) NOT NULL UNIQUE,
#    email VARCHAR(120) NOT NULL UNIQUE,
#    password_hash VARCHAR(128) NOT NULL,
#    role ENUM('user', 'admin') DEFAULT 'user',
#    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#)
#"""

# KOD ZA PRAVLJENJE auctions table-a
#create_table_query = """
#CREATE TABLE auctions (
#    id INT AUTO_INCREMENT PRIMARY KEY,
#    title VARCHAR(255) NOT NULL,
#    description TEXT NOT NULL,
#    starting_price DECIMAL(10, 2) NOT NULL,
#    end_date DATETIME NOT NULL,
#    main_image_url VARCHAR(255),
#    category_id INT,
#    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
#)
#"""

# KOD ZA PRAVLJENJE auction_images table-a
#create_table_query = """
#         CREATE TABLE auction_images (
#           id INT AUTO_INCREMENT PRIMARY KEY,
#            auction_id INT NOT NULL,
#            image_url VARCHAR(255) NOT NULL,
#            FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE
#         )
#       """

# KOD ZA PRAVLJENJE bids table-a
#create_table_query = """
#CREATE TABLE bids (
#    id INT AUTO_INCREMENT PRIMARY KEY,
#    auction_id INT NOT NULL,
#    user_id INT NOT NULL,
#    amount DECIMAL(10, 2) NOT NULL,
#    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#    FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE,
#    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
#)
#"""

#KOD ZA PRAVLJENE categories table-a
#create_table_query = """
#CREATE TABLE categories (
#   id INT AUTO_INCREMENT PRIMARY KEY,
#    name VARCHAR(255) NOT NULL UNIQUE
#)
#"""

#KOD ZA UBACIVANJE kategorija u categories table
#insert_auctions_query = """
#INSERT INTO categories (name) VALUES
#('Elektronika'),
#('Vozila'),
#('Dom i Vrt'),
#('Moda i Oprema'),
#('Kolekcije i Umjetnost'),
#('Sport i Rekreacija'),
#('Igračke i Igre'),
#('Knjige i Mediji'),
#('Posao i Industrija'),
#('Zdravlje i Ljepota'),
#('Kućni Ljubimci i Životinje'),
#('Razno');
#"""

#mycursor.execute(insert_auctions_query)

#mycursor.execute(create_table_query)

#db.commit()

#mycursor.execute("CREATE DATABASE user_auth_db"



