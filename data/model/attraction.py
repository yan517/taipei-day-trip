from extensions import db

class Attraction(db.Model):
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
    url = db.Column(db.String(1000), nullable=False)