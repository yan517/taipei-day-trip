from flask import *
from data.api.attraction import attractionApp
from extensions import db
from dotenv import load_dotenv
import os

app=Flask(__name__)
load_dotenv()
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DBCONN_STR')

db.init_app(app)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html", id = id)
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

app.register_blueprint(attractionApp)

app.run(host='0.0.0.0',port=3000)		