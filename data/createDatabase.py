import mysql.connector
import os
from dotenv import load_dotenv
load_dotenv()

mydb = mysql.connector.connect(host=os.getenv('DBHOST'),
                               user=os.getenv('DBROOT'),
                               password=os.getenv('DBPASSWORD'))

try:
    cursor = mydb.cursor()
    cursor.execute('CREATE DATABASE taipeidaytripdb;')  
finally:
    # closing database connection.
    cursor.close()                                     