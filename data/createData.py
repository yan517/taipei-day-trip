from flask import Flask
import json
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DBCONN_STR')
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255),nullable=False)
    password = db.Column(db.String(255),nullable=False)
    email = db.Column(db.String(255), unique=True ,nullable=False)

""" class Attraction(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True)
    lat = db.Column(db.Numeric(20,6))
    lng = db.Column(db.Numeric(20,6))
    description = db.Column(db.String(8000))
    address = db.Column(db.String(1000))
    mrt =  db.Column(db.String(100))
    category = db.Column(db.String(100))
    transport = db.Column(db.String(1000))
    images = db.relationship('Image', backref='attraction')
    
class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    attraction_id = db.Column(db.Integer, db.ForeignKey('attraction.id'), nullable=False)
    url = db.Column(db.String(1000), nullable=False) """

with app.app_context():
    db.create_all()
"""     with open('./taipei-attractions.json',"r",encoding="utf-8") as f:
        data = json.load(f)
        attracts = []
        for item in data['result']['results']:
            pic = item['file'].lower().split("https://")
            imgs = []
            for i in pic:
                if (i[-4:] == ".png" or i[-4:] == ".jpg"):
                    imgs.append(Image(url="https://"+i))
            attracts.append(Attraction(name=item['name'], lat=item['latitude'],lng=item['longitude'], description=item['description'], address=item['address'],mrt=item['MRT'], category=item['CAT'],transport=item['direction'], images=imgs))
    db.session.add_all(attracts)
    db.session.commit() """