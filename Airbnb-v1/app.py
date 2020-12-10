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
from sqlalchemy import func

from sqlalchemy.orm import aliased

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
    airbnb_count = db.Column(db.Integer)
    other_count = db.Column(db.Integer)
    avg_occupancy = db.Column(db.Float)
    median_price = db.Column(db.Float)
    sqft_price = db.Column(db.Float)

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

class Nbh_Insights(db.Model):
    __tablename__ = 'neighborhood_insights'

    nbh_id = db.Column(db.Integer, primary_key=True)
    rental_income = db.Column(db.Float)
    rental_income_change = db.Column(db.String(64))
    rental_income_change_pct = db.Column(db.Float)
    occupancy = db.Column(db.Float)
    occupancy_change  = db.Column(db.String(64))
    occupancy_change_pct = db.Column(db.Float)
    reviews_count_slope = db.Column(db.Float)
    reviews_count_rsquare = db.Column(db.Float)
    def __repr__(self):
        return '<nbh_id %r>' % (self.nbh_id)
## end Nbh_Insights() class

class Listing_Info(db.Model):
    __tablename__ = 'listings_info'

    airbnb_id = db.Column(db.Integer, primary_key=True)
    nbh_id = db.Column(db.Integer)
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    city  = db.Column(db.String(64))
    state  = db.Column(db.String(64))
    night_price = db.Column(db.Float)
    cleaning_fee = db.Column(db.Float)
    nights_booked = db.Column(db.Float)
    rental_income = db.Column(db.Float)
    property_type  = db.Column(db.String(64))
    room_count = db.Column(db.Integer)
    bed_count = db.Column(db.Integer)
    max_capacity = db.Column(db.Integer)
    star_rating = db.Column(db.Float)
    total_reviews = db.Column(db.Integer)


    def __repr__(self):
        return '<airbnb_id %r>' % (self.airbnb_id)
## end Listing_Info() class



class Rental_Rates(db.Model):
    __tablename__ = 'rental_rates'

    nbh_id = db.Column(db.Integer, primary_key=True)
    studio = db.Column(db.Integer)
    one_room = db.Column(db.Integer)
    two_room = db.Column(db.Integer)
    three_room = db.Column(db.Integer)
    four_room = db.Column(db.Integer)

    def __repr__(self):
         return '<nbh_id %r>' % (self.nbh_id)
## end  Rental_Rates() class

class Rental_Rates_Info(db.Model):
    __tablename__ = 'rental_rates_info'

    nbh_id = db.Column(db.Integer, primary_key=True)
    bed_number = db.Column(db.Integer)
    count = db.Column(db.Integer)
    avg = db.Column(db.Float)
    rental_income = db.Column(db.Float)
    median_value = db.Column(db.Float)
    median_night_rate = db.Column(db.Float)
    median_occupancy = db.Column(db.Float)

    def __repr__(self):
         return '<nbh_id %r>' % (self.nbh_id)
## end  Rental_Rates_Info() class


class Census_Crime(db.Model):
    __tablename__ = 'merged_census_crime'

    crime_id = db.Column(db.Integer, primary_key=True)
    nbh_id = db.Column(db.Integer)
    TotalPop = db.Column(db.Integer)
    IncomePerCap = db.Column(db.Integer)
    Crime_RatePer100K = db.Column(db.Float)
    
    def __repr__(self):
        return '<crime_id %r>' % (self.crime_id)
## end Census_Crime() class



#################################################

# Query the database and send the jsonified results
@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        city = request.form["city"]
        state = request.form["state"]
        city = Cities(city=city, state=state)
        return redirect("/", code=302)
    return render_template("form.html")
## end send() route

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")
## end home() route

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
@app.route("/api/census-crime")
def census_crime():
    results = db.session.query(Census_Crime.crime_id, Census_Crime.nbh_id, Census_Crime.TotalPop, Census_Crime.IncomePerCap, Census_Crime.Crime_RatePer100K).all()

    crime_id = [result[0] for result in results]
    nbh_id = [result[1] for result in results]
    total_pop = [result[2] for result in results]
    income_cap = [result[3] for result in results]
    crime_rate = [result[4] for result in results]

    census_crime_data = [{
        "crime_id": crime_id,
        "nbh_id": nbh_id,
        "total_pop": total_pop,
        "income_cap": income_cap,
        "crime_rate": crime_rate
    }]
    return jsonify(census_crime_data)
## end census_crime() route


#################################################
@app.route("/api/statistics/<city_id>/<nbh_id>")
def statistics(city_id, nbh_id):
    print("inside")
    
    # retrieve overview and insights data 
    if nbh_id != "0":
        results =  db.session.query(Nbh_Overview.nbh_id.label("nbh_id"), \
                            func.sum(Nbh_Overview.airbnb_count).label("airbnb_count"),\
                            func.sum(Nbh_Overview.other_count).label("other_count"),\
                            func.sum(Nbh_Overview.avg_occupancy).label("avg_occupancy"),\
                            func.sum(Nbh_Overview.median_price).label("median_price"),\
                            func.avg(Nbh_Overview.sqft_price).label("sqft_price"),\
                            func.sum(Nbh_Insights.rental_income).label("rental_income"),\
                            func.sum(Nbh_Insights.rental_income_change_pct).label("rental_income_change_pct"),\
                            func.sum(Nbh_Insights.occupancy).label("occupancy"),\
                            func.sum(Nbh_Insights.occupancy_change_pct).label("occupancy_change_pct"),\
                            func.sum(Nbh_Insights.reviews_count_slope).label("reviews_count_slope"),\
                            func.sum(Nbh_Insights.reviews_count_rsquare).label("reviews_count_rsquare"),\
                            func.sum(Listing_Info.night_price).label("night_price"),\
                            func.sum(Listing_Info.cleaning_fee).label("cleaning_fee"),\
                            func.sum(Listing_Info.nights_booked).label("nights_booked"),\
                            func.sum(Listing_Info.rental_income).label("rental_income"),
                            func.sum(Listing_Info.total_reviews).label("total_reviews"))\
                    .join(Nbh_Insights, Nbh_Overview.nbh_id==Nbh_Insights.nbh_id)  \
                    .join(Listing_Info, Nbh_Overview.nbh_id==Listing_Info.nbh_id)  \
                    .filter(Nbh_Overview.nbh_id == nbh_id)\
                    .group_by(Nbh_Overview.nbh_id)
    else:
        results =  db.session.query(City_Nbh.city_id.label("city_id"), func.sum(Nbh_Overview.airbnb_count).label("airbnb_count"),\
                            func.sum(Nbh_Overview.other_count).label("other_count"),\
                            func.avg(Nbh_Overview.avg_occupancy).label("avg_occupancy"),\
                            func.avg(Nbh_Overview.median_price).label("median_price"),\
                            func.avg(Nbh_Overview.sqft_price).label("sqft_price"),\
                            func.avg(Nbh_Insights.rental_income).label("rental_income"),\
                            func.avg(Nbh_Insights.rental_income_change_pct).label("rental_income_change_pct"),\
                            func.avg(Nbh_Insights.occupancy).label("occupancy"),\
                            func.avg(Nbh_Insights.occupancy_change_pct).label("occupancy_change_pct"),\
                            func.avg(Nbh_Insights.reviews_count_slope).label("reviews_count_slope"),\
                            func.avg(Nbh_Insights.reviews_count_rsquare).label("reviews_count_rsquare"),\
                            func.avg(Listing_Info.night_price).label("night_price"),\
                            func.avg(Listing_Info.cleaning_fee).label("cleaning_fee"),\
                            func.avg(Listing_Info.nights_booked).label("nights_booked"),\
                            func.avg(Listing_Info.rental_income).label("rental_income"),
                            func.sum(Listing_Info.total_reviews).label("total_reviews"))\
                    .join(Nbh_Insights, Nbh_Overview.nbh_id==Nbh_Insights.nbh_id)  \
                    .join(Listing_Info, Nbh_Overview.nbh_id==Listing_Info.nbh_id)  \
                    .join(City_Nbh, City_Nbh.nbh_id ==  Nbh_Overview.nbh_id)\
                    .filter(City_Nbh.city_id == city_id)\
                    .group_by(City_Nbh.city_id)

 
    statList = []
    
    for result in results :
        StatData = {
            "statinfo" :
            {
                "city_id" : city_id,
                "nbh_id" : nbh_id,
                "airbnb_count": str(result[1]),
                "other_count": str(result[2]),
                "avg_occupancy": str(result[3]),
                "median_price": str(result[4]),
                "sqft_price": str(result[5]) ,
                "rental_income" : str(result[6]),
                "rental_income_change_pct" : str(result[7]),
                "occupancy" : str(result[8]),
                "occupancy_change_pct" : str(result[9]),
                "reviews_count_slope" : str(result[10]),
                "reviews_count_rsquare" : str(result[11]),
                "night_price" : str(result[12]),
                "cleaning_fee" : str(result[13]),
                "nights_booked" : str(result[14]),
                "rental_income" : str(result[15]),
                "review_count" : str(result[16])
            }
        }
        statList.append(StatData)
    
    return jsonify(statList)
## end statistics() route

#################################################
@app.route("/api/rental_size/<city_id>/<nbh_id>")
def rentalSize(city_id, nbh_id):
  
      # retrieve rental rates data 
    if nbh_id != "0":
        results =  db.session.query(
                        Rental_Rates_Info.bed_number, \
                        Rental_Rates_Info.count,\
                        Rental_Rates_Info.rental_income,\
                        Rental_Rates_Info.median_value,\
                        Rental_Rates_Info.median_night_rate,\
                        Rental_Rates_Info.median_occupancy)\
                        .filter(Rental_Rates_Info.nbh_id == nbh_id) 
    else:
        results =  db.session.query(
                        Rental_Rates_Info.bed_number.label("bed_number"),\
                        func.sum(Rental_Rates_Info.count).label("count"),\
                        func.avg(Rental_Rates_Info.rental_income).label("rental_income"),\
                        func.avg(Rental_Rates_Info.median_value).label("median_value"),\
                        func.avg(Rental_Rates_Info.median_night_rate).label("median_night_rate"),\
                        func.avg(Rental_Rates_Info.median_occupancy).label("median_occupancy"))\
                    .join(City_Nbh, City_Nbh.nbh_id ==  Rental_Rates_Info.nbh_id)\
                    .filter(City_Nbh.city_id == city_id)\
                    .group_by(Rental_Rates_Info.bed_number)


    rentalInfoList = []
    
    for result in results :
        rentalData = {
            "Rentalinfo" :
            {
                "city_id" : city_id,
                "nbh_id" : nbh_id,
                "bed_number": str(result[0]),
                "count": str(result[1]),
                "rental_income": str(result[2]),
                "median_value": str(result[3]),
                "median_night_rate": str(result[4]) ,
                "median_occupancy" : str(result[5])
            }
        }
        rentalInfoList.append(rentalData)
    
    return jsonify(rentalInfoList)

## end rental_rates() route


###############################################
@app.route("/api/rental_type/<city_id>/<nbh_id>")
def rentalType(city_id, nbh_id):

    # retrieve rental rates data 
    if nbh_id != "0":
        results =  db.session.query(
                        Listing_Info.night_price,\
                        Listing_Info.cleaning_fee,\
                        Listing_Info.nights_booked,\
                        Listing_Info.rental_income,\
                        Listing_Info.property_type)\
                        .filter(Listing_Info.nbh_id == nbh_id) 
    else:
        results =  db.session.query(
                        Listing_Info.property_type.label("property_type"),\
                        func.sum(Listing_Info.night_price).label("night_price"),\
                        func.avg(Listing_Info.cleaning_fee).label("cleaning_fee"),\
                        func.avg(Listing_Info.nights_booked).label("nights_booked"),\
                        func.avg(Listing_Info.rental_income).label("rental_income"))\
                    .join(City_Nbh, City_Nbh.nbh_id ==  Listing_Info.nbh_id)\
                    .filter(City_Nbh.city_id == city_id)\
                    .group_by(Listing_Info.property_type)

    rentalTypeList = []
    
    for result in results :
        rentalData = {
            "Rentalinfo" :
            {
                "city_id" : city_id,
                "nbh_id" : nbh_id,
                "property_type": str(result[0]),
                "night_price": str(result[1]),
                "cleaning_fee": str(result[2]),
                "nights_booked": str(result[3]),
                "rental_income": str(result[4]) 
            }
        }
        rentalTypeList.append(rentalData)
    
    return jsonify(rentalTypeList)

## end rental_type() route

#################################################
if __name__ == "__main__":
    app.run()
#################################################