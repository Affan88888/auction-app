import mysql.connector

db = mysql.connector.connect(
       host="localhost",
       user="affan",
       passwd="Venvscripts333_",
       database="user_auth_db"
    )

mycursor = db.cursor()

#mycursor.execute("CREATE DATABASE user_auth_db")

#mycursor.execute("CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,username VARCHAR(80) NOT NULL UNIQUE,email VARCHAR(120) NOT NULL UNIQUE,password_hash VARCHAR(128) NOT NULL,role ENUM('user', 'admin') DEFAULT 'user',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")

#mycursor.execute("DESCRIBE Person")

mycursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s,%s,%s)", ('john_doe', 'john@example.com', 'hashed_password'))
db.commit()

#mycursor.execute("SELECT * FROM Person")

#for x in mycursor:
   # print(x)

#mycursor.execute("DROP DATABASE testdatabase")