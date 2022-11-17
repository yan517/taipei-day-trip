from flask import *
from extensions import db
from data.model.attraction import Attraction, Image
from sqlalchemy import or_

attractionApp = Blueprint('attractionApp', __name__)

@attractionApp.route("/api/categories", methods=["GET"])
def apiCategories():
	try:
		cat = Attraction.query.with_entities(Attraction.category).distinct()
		catArr = []
		for row in cat:
			catArr.append(row[0])	
		if catArr:
			return make_response(jsonify({"data":catArr}),200)
		else:
			return make_response(jsonify({"error": True, "message": "Category cannot find"}),500)
	except:
		return make_response(jsonify({"error": True, "message": "Internal server error"}),500)
	


@attractionApp.route("/api/attraction/<value>")
def getAttractionInfo(value):
	try:
		info = Attraction.query.filter_by(id=value).first()
		if info:
			data = createDataObj(info)
			return make_response(jsonify({"data":data}),200)
		else:
			return make_response(jsonify({"error": True, "message": "Attraction Id is not correct."}),400)
	except:
		return make_response(jsonify({"error": True, "message": "Internal server error"}),500)

@attractionApp.route("/api/attractions", methods=["GET"])
def getAttractions():
	if 'page' in request.args:
		page = int(request.args.get("page"))
		result = []
		pageSize = 12
		start = page*pageSize
		if 'keyword' in request.args:
			keyword = request.args.get("keyword")
			data = Attraction.query.filter(or_(Attraction.name.like('%'+keyword+'%'), Attraction.category == keyword)).offset(start).limit(pageSize).all()
			if data:
				for item in data:
					result.append(createDataObj(item))			
			return make_response(jsonify({"data":result,"nextPage": page+1 if len(result) == pageSize else None}),200)
		else:
			data = Attraction.query.offset(start).limit(pageSize).all()
			if data:
				for item in data:
					result.append(createDataObj(item))
			return make_response(jsonify({"data":result,"nextPage": page+1 if len(result) == pageSize else None}),200)
	else:
		return make_response(jsonify({"error": True, "message": "Internal server error"}),500)

def createDataObj(item):
	imgs = Image.query.filter_by(attraction_id=item.id).all()
	imgArr = []
	for i in imgs:
		imgArr.append(i.url)					
	return {
		"id":item.id,
		"name": item.name,
		"category": item.category,
		"description": item.description,
		"address": item.address,
		"transport": item.transport,
		"mrt": item.mrt,
		"lat": item.lat,
		"lng": item.lng,
		"images": imgArr,		
	}