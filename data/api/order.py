from flask import *
from extensions import db,bcrypt
from data.model.booking import Booking
from data.model.order import Order
from data.model.attraction import Attraction, Image
from data.model.user import User
from sqlalchemy import and_
import requests
import datetime, os
from dotenv import load_dotenv
load_dotenv()

orderApp = Blueprint('orderApp', __name__ , static_folder='static')

@orderApp.route("/api/orders", methods=["POST"])
def creteOrder():
    value = request.get_json()
    if session.get('Token'):
        if session['Token']:  
            if (value["prime"] and value["order"]["contact"]["email"] and value["order"]["contact"]["name"] and value["order"]["contact"]["phone"]):
                try:
                    tonow = datetime.datetime.now()
                    getOrderLen = len(Order.query.all())+1
                    for item in value["order"]["trips"]["attraction"]:
                        createOrder = Order(number=(str(tonow.year)+str(tonow.month)+str(tonow.day)+str(getOrderLen)),name=value["order"]["contact"]["name"],email=value["order"]["contact"]["email"],phone=value["order"]["contact"]["phone"],
                        status=1,booking_id=item["bookingId"],user_id=value["user_id"],attraction_id=item["attraction"]["id"])
                        db.session.add(createOrder)
                        db.session.commit()
                    post_data = {
                        'prime': value["prime"],
                        'partner_key': os.getenv('PARTNERKEY'),
                        'merchant_id': os.getenv('MERCHANTID'),
                        'details': value["order"]["contact"]["name"]+"的訂單",
                        'amount': value["order"]["price"],
                        'cardholder': {
                            'phone_number': value["order"]["contact"]["phone"],
                            'name': value["order"]["contact"]["name"],
                            'email': value["order"]["contact"]["email"]
                        },
                        'remember': False
                    }
                    res = requests.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime',
                    json = post_data, 
                    timeout=30,
                    headers={'content-type': 'application/json',
                            'x-api-key': os.getenv('PARTNERKEY')}
                    ).json()
                    if (res["status"] == 0):
                            updateOrder = Order.query.filter_by(number=str(tonow.year)+str(tonow.month)+str(tonow.day)+str(getOrderLen)).all()
                            for order in updateOrder:
                                order.status = res["status"]
                                db.session.commit()
                            data = {
                                "number": str(tonow.year)+str(tonow.month)+str(tonow.day)+str(getOrderLen),
                                "payment": {
                                    "status": res["status"],
                                    "message": "付款成功"
                                }
                            }
                    else: 
                        data = {
                            "number": str(tonow.year)+str(tonow.month)+str(tonow.day)+str(getOrderLen),
                            "payment": {
                                "status": res["status"],
                                "message": "付款失敗"
                            }
                        }
                    return make_response(jsonify({"data": data}),200)
                except:
                    return make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}),500)
            else:
                return make_response(jsonify({"error": True, "message": "訂單建立失敗，輸入不正確或其他原因"}),400)
        else:
            return make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}),403)
    else:
        return make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}),403)

@orderApp.route("/api/order/<orderNumber>", methods=["GET"])
def getOrderNumber(orderNumber):
    if session.get('Token'):
        if session['Token']: 
            try:
                result = Order.query.filter_by(number=str(orderNumber)).join(User, Order.user_id==User.id).join(Attraction, Order.attraction_id==Attraction.id).join(Image, Image.attraction_id==Attraction.id).join(Booking, Order.booking_id==Booking.id).all()
                if (result):
                    attraction = []
                    price = 0
                    for item in result:
                        price = price + int(item.booking.price)
                        attraction.append({
                            "attraction":{
                                "id": item.attraction.id,
                                "name": item.attraction.name,
                                "address": item.attraction.address,
                                "image": item.attraction.images[0].url
                            },
                        "date": item.booking.date,
                        "time": item.booking.time
                        })
                    print(result[0].number)    
                    return make_response(jsonify({
                        "data":  {
                            "number": result[0].number,
                            "price": price,
							"trip": attraction,
                            "contact": {
                                "name": result[0].name,
                                "email": result[0].email,
                                "phone": result[0].phone
                            },
                            "status": result[0].status   
                        }
                    }),200)
                else:
                    return make_response(jsonify({"data": None}),200)
            except:
                return make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}),500)
        else:
            return make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}),403)
    else:
        return make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}),403)            

@orderApp.route("/api/ordered", methods=["GET"])
def getOrders():
    if session.get('Token'):
        if session['Token']: 
            try:
                id = request.args.get("id")
                result = []
                orders = Order.query.filter_by(user_id=id).group_by(Order.number).order_by(Order.id.desc()).limit(10).all()
                if (orders):
                    for i in orders:
                        result.append({
                            "order_number":  i.number,
                            "status":  i.status,
                            "email":  i.email,
                            "phone":  i.phone,
                            "name" : i.name
                        })
                    return make_response(jsonify({"data": result}),200)
                else:
                    return make_response(jsonify({"data": None}),200)
            except:
                return make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}),500)
        else:
            return make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}),403)
    else:
        return make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}),403)    