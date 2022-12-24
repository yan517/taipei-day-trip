from flask import Flask
import json
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from sqlalchemy import and_

app = Flask(__name__)
load_dotenv()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DBCONN_STR')
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    """name = db.Column(db.String(255),nullable=False)
    password = db.Column(db.String(255),nullable=False)
    email = db.Column(db.String(255), unique=True ,nullable=False)
    booking = db.relationship('Booking', backref='user')"""
    order = db.relationship('Order', backref='user')

class Attraction(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    """ name = db.Column(db.String(80), unique=True)
    lat = db.Column(db.Numeric(20,6))
    lng = db.Column(db.Numeric(20,6))
    description = db.Column(db.String(8000))
    address = db.Column(db.String(1000))
    mrt =  db.Column(db.String(100))
    category = db.Column(db.String(100))
    transport = db.Column(db.String(1000))
    images = db.relationship('Image', backref='attraction') 
    booking = db.relationship('Booking', backref='attraction')"""
    order = db.relationship('Order', backref='attraction')
    
"""class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    attraction_id = db.Column(db.Integer, db.ForeignKey('attraction.id'), nullable=False)
    url = db.Column(db.String(1000), nullable=False) """

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    """ date = db.Column(db.DateTime(50),nullable=False)
    time = db.Column(db.String(50),nullable=False)
    price = db.Column(db.String(50),nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    attraction_id = db.Column(db.Integer, db.ForeignKey('attraction.id'), nullable=False) """
    order = db.relationship('Order', backref='booking')

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    number = db.Column(db.String(255),nullable=False)
    name = db.Column(db.String(255),nullable=False)
    email = db.Column(db.String(255),nullable=False)
    phone = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Integer, nullable=False)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    attraction_id = db.Column(db.Integer, db.ForeignKey('attraction.id'), nullable=False)

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