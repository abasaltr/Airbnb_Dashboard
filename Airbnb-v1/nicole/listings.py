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
from pprint import pprint

def getlistingsInfo(city_id, nbh_id):
    # get the cities, neighborhood, map class from the database SQL Map - could not access the bridge table
# creates an connection object
    engine = create_engine(f'postgresql://{user}:{password}@localhost:5432/airbnb_db')

#bind the session
    session = Session(bind=engine)

    nbh_ids =[]

    if nbh_id == 0:
        sqlQuery = f"select * from city_nbh where city_id = {city_id}"
        city_nbh_df = pd.read_sql(sqlQuery, con=engine)  
    else:
        sqlQuery = f"select * from city_nbh where city_id = {city_id} and nbh_id = {nbh_id}"
        city_nbh_df = pd.read_sql(sqlQuery, con=engine)  

    sqlNbh =""
    for i, r in city_nbh_df.iterrows():
        sqlNbh = sqlNbh + str(r[0]) + " ,"
    sqlNbh = sqlNbh[:-1]
        
    sqlQuery = f"select airbnb_id, nbh_id, city, state, lat, lon, night_price, cleaning_fee from listings_info where nbh_id in ({sqlNbh})";
    rental_df= pd.read_sql(sqlQuery, con=engine)  

    df_merge_table = pd.merge(city_nbh_df, rental_df, on='nbh_id')

    return df_merge_table
