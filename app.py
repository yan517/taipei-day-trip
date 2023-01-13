from flask import *
from data.api.attraction import attractionApp
from data.api.user import userApp
from data.api.booking import bookingApp
from data.api.order import orderApp
from extensions import db,bcrypt
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
import os

app=Flask(__name__)
cors = CORS(app)

load_dotenv()
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DBCONN_STR')
app.secret_key = os.getenv('secret_key')
apiaddress = os.getenv('IPADDRESS')

db.init_app(app)
bcrypt.init_app(app)

# Pages
@app.route("/")
@cross_origin()
def index():
	return render_template("index.html", apiaddress = apiaddress)
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html", id = id, apiaddress = apiaddress)
@app.route("/booking")
def booking():
	return render_template("booking.html", key = os.getenv('APPKEY'), app_id = os.getenv('APPID'), apiaddress = apiaddress)
@app.route("/thankyou", methods=["GET"])
def thankyou():
	if 'number' in request.args:
		number = request.args['number']
	return render_template("thankyou.html", num = number, apiaddress = apiaddress)
@app.route("/member")
def member():
	return render_template("member.html", apiaddress = apiaddress)

app.register_blueprint(attractionApp, url_prefix='')
app.register_blueprint(userApp, url_prefix='')
app.register_blueprint(bookingApp, url_prefix='')
app.register_blueprint(orderApp, url_prefix='')

#app.run(port=3000)		
app.run(host='0.0.0.0',port=3000)		