from flask import *
from extensions import db,bcrypt
from data.model.user import User
from sqlalchemy import or_
import datetime, jwt, os
from dotenv import load_dotenv
load_dotenv()

userApp = Blueprint('userApp', __name__ , static_folder='static')

@userApp.route("/api/user", methods=["POST"])
def register():
    value = request.get_json()
    username = value["name"]
    mail = value["mail"]
    pwd = value["password"]
    if (username and mail and pwd):
        try:
            check_user_exist = User.query.filter_by(email=mail).first()
            if not check_user_exist:
                encodePWD = bcrypt.generate_password_hash(pwd).decode('utf-8')
                enroll = User(name=username,password=encodePWD,email=mail)
                db.session.add(enroll)
                db.session.commit()
                return make_response(jsonify({"ok": True}),200)
            else:
                return make_response(jsonify({"error": True, "message": "電郵已被註冊"}),400)
        except:
            return make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}),500)
    else:
        return make_response(jsonify({"error": True, "message": "帳號或密碼或電郵不能空白"}),400)            

@userApp.route("/api/user/auth", methods=["PUT"])
def signIn():
    value = request.get_json()
    mail = value['mail']
    pwd = value['password']
    if (mail and pwd):
        try:
            check_user_exist = User.query.filter_by(email=mail).first()
            if check_user_exist:
                if bcrypt.check_password_hash(check_user_exist.password, pwd):
                    encodeData = {'email': mail, 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)}
                    encoded_jwt = jwt.encode(encodeData, os.getenv('Token_key'), algorithm="HS256")
                    session["Token"] = encoded_jwt
                    return make_response(jsonify({"ok": True}),200)
                else:
                    return make_response(jsonify({"error": True, "message": "帳號或密碼錯誤"}),400)
            else:
                return make_response(jsonify({"error": True, "message": "沒有此用戶"}),400)        
        except:
            return make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}),500)
    else:
        return make_response(jsonify({"error": True, "message": "帳號或密碼不能空白"}),400)          

@userApp.route("/api/user/auth", methods=["DELETE"])
def logout():
    session.pop('Token',None)
    return make_response(jsonify({"ok": True}),200)

@userApp.route("/api/user/auth", methods=['GET'])
def getUser(): 
    if session.get('Token'):
        if session['Token']:   
            value = jwt.decode(session['Token'], os.getenv('Token_key'), algorithms=["HS256"])
            mail = value["email"]
            try:
                user = User.query.filter_by(email=mail).first()
                if user:
                    return make_response(jsonify(
                        {"data": {
                            "id": user.id,
                            "name": user.name,
                            "email": user.email
                        }}),200)
                else:
                    return {"data": None}
            except:
                return make_response(jsonify({"error": True, "message": "伺服器內部錯誤"}),500)
        else:
            return {"data": None}           
    else:
        return {"data": None}      