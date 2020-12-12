# import necessary libraries
import os
import numpy as np

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from flask_sqlalchemy import SQLAlchemy

# Postgres database user and password import
from db_key import user, password

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
try:
    db_uri = os.environ['DATABASE_URL']
except KeyError:
    db_uri = f'postgres://{user}:{password}@localhost:5432/airbnb_db'
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
db = SQLAlchemy(app)

#################################################
# Create classes to frame database table instance
#################################################
class Cities(db.Model):
    __tablename__ = 'top_airbnb_cities'

    city_id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(64))
    state = db.Column(db.String(64))

    def __repr__(self):
        return '<City %r>' % (self.city)
## end Cities() class

class Nbh_Overview(db.Model):
    __tablename__ = 'neighborhood_overview'

    nbh_id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    walkscore = db.Column(db.Integer)

    def __repr__(self):
        return '<Walkscore %r>' % (self.walkscore)
## end Nbh_Overview() class

class Nbh(db.Model):
    __tablename__ = 'top_neighborhood_overview'

    nbh_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    county = db.Column(db.String(64))
    state = db.Column(db.String(64))

    def __repr__(self):
        return '<Name %r>' % (self.name)
## end Nbh() class

class City_Nbh(db.Model):
    __tablename__ = 'city_nbh'

    nbh_id = db.Column(db.Integer, primary_key=True)
    city_id = db.Column(db.Integer, primary_key=True)

    def __repr__(self):
        return '<city_nbh %r>' % (self.nbh_id)
## end city_nbh() class

class Listings_Info(db.Model):
    __tablename__ = 'listings_info'

    airbnb_id = db.Column(db.Integer, primary_key=True)
    nbh_id = db.Column(db.Integer)
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    city = db.Column(db.String(64))
    state = db.Column(db.String(2))
    night_price = db.Column(db.Float)
    cleaning_fee = db.Column(db.Float)
    nights_booked = db.Column(db.Integer)
    rental_income = db.Column(db.Float)
    property_type = db.Column(db.String(64))
    room_count = db.Column(db.Integer)
    bed_count = db.Column(db.Integer)
    max_capacity = db.Column(db.Integer)
    star_rating = db.Column(db.Float)
    total_reviews = db.Column(db.Integer)
    date_created = db.Column(db.Date)
    date_updated = db.Column(db.Date)

    def __repr__(self):
        return '<airbnb_id %r>' % (self.airbnb_id)
## end city_nbh() class


#################################################

# Query the database and send the jsonified results
@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        city = request.form["city"]
        state = request.form["state"]
        city = Cities(city=city, state=state)
        return redirect("/", code=302)
    return render_template("heatmap.html")
## end send() route

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")
## end home() route

# create route that renders index.html template
@app.route("/map/<nbh_id>")
def openHeatMap(nbh_id):
    jdata = getHeatData(nbh_id)
    return render_template("heatmap.html")
## end openHeatMap() route

@app.route("/api/map/<nbh_id>")
def getHeatData(nbh_id):

    results = db.session.query(Listings_Info.airbnb_id, Listings_Info.nbh_id,
                Listings_Info.lat, Listings_Info.lon, Listings_Info.city, Listings_Info.state, Listings_Info.night_price,
                Listings_Info.cleaning_fee, Listings_Info.nights_booked, Listings_Info.rental_income, Listings_Info.property_type, 
                Listings_Info.room_count, Listings_Info.bed_count, Listings_Info.max_capacity, Listings_Info.star_rating,
                Listings_Info.total_reviews, Listings_Info.date_created, Listings_Info.date_updated,
                Nbh.name, Nbh.county )\
        .filter(Listings_Info.nbh_id==nbh_id)\
        .join(Nbh, Listings_Info.nbh_id==Nbh.nbh_id)\
        .all()

    airbnb_id = [result[0] for result in results]
    nbh_ids = [result[1] for result in results]
    nbh_name = [result[18] for result in results]
    county = [result[19] for result in results]
    lat = [result[2] for result in results]
    lon = [result[3] for result in results]
    city = [result[4] for result in results]
    state = [result[5] for result in results]
    night_price = [result[6] for result in results]
    cleaning_fee =[result[7] for result in results]
    nights_booked = [result[8] for result in results]
    rental_income = [result[9] for result in results]
    property_type = [result[10] for result in results]
    room_count = [result[11] for result in results]
    bed_count = [result[12] for result in results]
    max_capacity = [result[13] for result in results]
    star_rating = [result[14] for result in results]
    total_reviews = [result[15] for result in results]
    date_created = [result[16] for result in results]
    date_updated = [result[17] for result in results]

    listings_data = [{
        "airbnb_id": airbnb_id, 
        "nbh_id":nbh_ids,
        "nbh_name": nbh_name,
        "county": county,
        "lat": lat, 
        "lon": lon, 
        "city": city,
        "state": state, 
        "night_price":night_price, 
        "cleaning_fee":cleaning_fee, 
        "nights_booked": nights_booked, 
        "rental_income": rental_income, 
        "property_type": property_type, 
        "room_count": room_count, 
        "bed_count": bed_count, 
        "max_capacity": max_capacity,
        "star_rating": star_rating, 
        "total_reviews": total_reviews, 
        "date_created": date_created, 
        "date_updated": date_updated
    }]

    return jsonify(listings_data)
## end getHeatData() route


#################################################
@app.route("/api/cities")
def city():
    
    results = db.session.query(Cities.city_id, Cities.city, Cities.state, City_Nbh.city_id, City_Nbh.nbh_id, Nbh.nbh_id, Nbh.name, Nbh.county)\
        .join(City_Nbh, Cities.city_id==City_Nbh.city_id)\
        .join(Nbh, City_Nbh.nbh_id==Nbh.nbh_id)\
        .all()

    city_id = [result[0] for result in results]
    city = [result[1] for result in results]
    state = [result[2] for result in results]
    nbh_id = [result[5] for result in results]
    nbh_name = [result[6] for result in results]
    county = [result[7] for result in results]

    city_data = [{
        "city_id":city_id, 
        "city": city,
        "state": state,
        "county": county,
        "nbh_id": nbh_id,
        "nbh_name": nbh_name
    }]
    return jsonify(city_data)
## end city() route

#################################################
@app.route("/api/nbh-overview")
def nbh_overview():
    results = db.session.query(Nbh_Overview.nbh_id, Nbh_Overview.latitude, Nbh_Overview.longitude, Nbh_Overview.walkscore, Nbh.name, Nbh.county)\
        .join(Nbh, Nbh_Overview.nbh_id==Nbh.nbh_id)\
        .all()

    nbh_id = [result[0] for result in results]
    nbh_name = [result[4] for result in results]
    lat = [result[1] for result in results]
    lon = [result[2] for result in results]
    walkscore = [result[3] for result in results]
    county = [result[5] for result in results]

    nbh_overview_data = [{
        "nbh_id": nbh_id,
        "nbh_name": nbh_name,
        "lat": lat,
        "lon": lon,
        "walkscore": walkscore,
        "county": county
    }]
    return jsonify(nbh_overview_data)
## end nbh_overview() route


#################################################
@app.route("/api/city-nbh")
def city_nbh():
    results = db.session.query(City_Nbh.nbh_id, City_Nbh.city_id).all()

    nbh_id = [result[0] for result in results]
    city_id = [result[1] for result in results]

    city_nbh_data = [{
        "nbh_id": nbh_id,
        "city_id": city_id
    }]
    return jsonify(city_nbh_data)
## end nbh_overview() route


#################################################
@app.route("/api/top-nbh")
def top_nbh():
    results = db.session.query(Nbh.nbh_id, Nbh.name, Nbh.county).all()

    nbh_id = [result[0] for result in results]
    name = [result[1] for result in results]
    county = [result[2] for result in results]

    top_nbh_data = [{
        "nbh_id": nbh_id,
        "name": name,
        "county":county
    }]
    return jsonify(top_nbh_data)
## end top_nbh() route



#################################################
if __name__ == "__main__":
    app.run()
#################################################