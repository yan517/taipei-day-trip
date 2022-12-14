from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255),nullable=False)
    password = db.Column(db.String(255),nullable=False)
    email = db.Column(db.String(255), unique=True ,nullable=False)
    booking = db.relationship('Booking', backref='user')
    order = db.relationship('Order', backref='user')