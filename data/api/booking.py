from flask import *
from extensions import db,bcrypt
from data.model.booking import Booking
from data.model.user import User
from data.model.attraction import Attraction, Image
from data.model.order import Order
from sqlalchemy import and_, or_
import datetime, jwt, os
from dotenv import load_dotenv
load_dotenv()

bookingApp = Blueprint('bookingApp', __name__ , static_folder='static')

@bookingApp.route("/api/booking", methods=["GET"])
def getBooking():
    userId = request.args.get("userId")
    if (userId):
            try:
                get_attractions_booking = Booking.query.filter(or_(and_(Booking.user_id==userId,Order.status==None),and_(Booking.user_id==1,Order.status!=0))).join(User, Booking.user_id==User.id).join(Attraction, Booking.attraction_id==Attraction.id).join(Image, Image.attraction_id==Attraction.id).outerjoin(Order, Order.booking_id==Booking.id).all()
                if get_attractions_booking:
                    data = []
                    for item in get_attractions_booking:
                        print(item)
                        value = {
                            "attraction": {
                            "id": item.attraction.id,
                            "name": item.attraction.name,
                            "address": item.attraction.address,
                            "image": item.attraction.images[0].url
                            },
                            "bookingId": item.id,
                            "date": item.date,
                            "time": item.time,
                            "price": item.price
                        }
                        data.append(value)
                    return make_response(jsonify({"data": data}),200)
                else:
                    return make_response(jsonify({"error": True, "message": "沒有記錄"}),400)
            except:
                return make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}),500)
    else:
        return make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}),403)

@bookingApp.route("/api/booking", methods=["POST"])
def createBooking():
    value = request.get_json()
    attractionId = value["attractionId"]
    bookingDate = value["date"]
    bookingTime = value["bookingTime"]
    bookingPrice = value["price"]
    userId = value["userId"]
    email = value["email"]
    if (userId):
        if (attractionId and bookingDate and bookingTime and bookingPrice):
            try:
                check_attractions_exist = Booking.query.filter(User.email==email,Booking.time==bookingTime,Booking.date==bookingDate).join(User, Booking.user_id==User.id).first()
                if not check_attractions_exist:
                    create = Booking(date=bookingDate,time=bookingTime,price=bookingPrice,user_id=userId,attraction_id=attractionId)
                    db.session.add(create)
                    db.session.commit()
                    return make_response(jsonify({"ok": True}),200)
                else:
                    return make_response(jsonify({"error": True, "message": "已有相同日子時間的預定行程"}),400)
            except:
                return make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}),500)
        else:
            return make_response(jsonify({"error": True, "message": "景點資料空白或錯誤"}),400)
    else:
        return make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}),403)

@bookingApp.route("/api/booking", methods=["DELETE"])
def deleteBooking():
    value = request.get_json()
    bookingId = value["bookingId"]
    userEmail = value["email"]
    userId = value["userId"]
    if (bookingId and userId and userEmail):
        try:
            if (User.query.filter(User.id==userId,User.email==userEmail).first()):
                Booking.query.filter(and_(Booking.user_id==userId,Booking.id==bookingId)).delete()
                db.session.commit()
                return make_response(jsonify({"ok": True}),200)
            else:
                return make_response(jsonify({"error": True, "message": "資料錯誤"}),404)
        except:
            return make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}),500)
    else:
        return make_response(jsonify({"error": True, "message": "未登入系統，拒絕存取"}),403)