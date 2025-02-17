import mysql.connector

db = mysql.connector.connect(
       host="localhost",
       user="your_database_user_here",
       passwd="your_database_password_here",
       database="your_database_name_here"
    )

mycursor = db.cursor()

# KOD ZA PRAVLJENJE auction_images table-a
#create_table_query = """
#         CREATE TABLE auction_images (
#           id INT AUTO_INCREMENT PRIMARY KEY,
#            auction_id INT NOT NULL,
#            image_url VARCHAR(255) NOT NULL,
#            FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE
#         )
#       """

# KOD ZA PRAVLJENJE auctions table-a
#create_table_query = """
#CREATE TABLE auctions (
#    id INT AUTO_INCREMENT PRIMARY KEY,
#    title VARCHAR(255) NOT NULL,
#    description TEXT NOT NULL,
#    starting_price DECIMAL(10, 2) NOT NULL,
#    end_date DATETIME NOT NULL,
#    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#)
#"""

#mycursor.execute(create_table_query)

#mycursor.execute("CREATE DATABASE user_auth_db")

#mycursor.execute("CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,username VARCHAR(80) NOT NULL UNIQUE,email VARCHAR(120) NOT NULL UNIQUE,password_hash VARCHAR(128) NOT NULL,role ENUM('user', 'admin') DEFAULT 'user',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")

#mycursor.execute("DESCRIBE Person")

#mycursor.execute("INSERT INTO users (username, email, password_hash, role) VALUES (%s,%s,%s,%s)", ('username', 'email', 'hashed_pass', 'role'))

#mycursor.execute("DELETE FROM users")
#db.commit()

#mycursor.execute("SELECT * FROM Person")

#for x in mycursor:
   # print(x)

#mycursor.execute("DROP DATABASE testdatabase")