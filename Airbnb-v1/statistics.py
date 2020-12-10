
# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base

# Imports the method used to connect to DBs
from sqlalchemy import create_engine

# function to establish a session with a connected database
from sqlalchemy.orm import Session

# import func
from sqlalchemy import  func

# from config import password
from db_key import user, password

# import requests for api call
import requests 
import pandas as pd 
import json
from pandas import json_normalize

class City_Nbh(db.Model):
    __tablename__ = 'city_nbh'

    nbh_id = db.Column(db.Integer, primary_key=True)
    city_id = db.Column(db.Integer, primary_key=True)

    def __repr__(self):
        return '<city_nbh %r>' % (self.nbh_id)
## end city_nbh() class



// a method to pull the information for the statistics 
def GetStatistics(city_id, nbh_id)
{

    # creates an connection object
    engine = create_engine(f'postgresql://{user}:{password}@localhost:5432/airbnb_db')

    # build the relationships from the database
    Base = automap_base()
    Base.prepare(engine, reflect=True)

    # map the class
    cities = Base.classes.top_airbnb_cities
    nbh_overview =  Base.classes.neighborhood_overview
    nbh_insights = Base.classes.neighborhood_insights

    #bind the session
    session = Session(bind=engine)

   sqlQuery = "select nbh"
   

    city_nbh_df = pd.read_sql(sqlQuery, con=engine)

    historical_df = pd.DataFrame(session.query(history_agg.record_id))


}