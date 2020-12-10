
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


# a method to get latest records from the api and store the records in the database
def IncrementalLoad(city):

   url = "https://public.opendatasoft.com/explore/dataset/airbnb-averages/api/?disjunctive.room_type&sort=date&rows=1000&refine.location=United+states"
   
  # if city name is provided then filter based on city
   if city != '':
       city = city.replace(' ', '+')
       url =  f"https://public.opendatasoft.com/explore/dataset/airbnb-averages/api/?disjunctive.room_type&sort=date&rows=1000&refine.location=United+states,+{city}"

    try :

        # request to api for the historical data
        airbnb_response = requests.get(url)
        airbnb_json = airbnb_response.json()

        # clean the dataset
        for airbnbAvg_record in airbnb_json["records"]:

            #remove the dataset from the json records
            if 'geo_shape' in airbnbAvg_record['fields']:
                del airbnbAvg_record['fields']['geo_shape']
            if 'geometry' in airbnbAvg_record:
                del airbnbAvg_record['geometry']
            if 'datasetid' in airbnbAvg_record:
                del airbnbAvg_record['datasetid']

            # normalize the dataset and store as dataframe
            airbnb_df = pd.DataFrame()
            try :
                airbnb_df =  json_normalize(airbnb_json["records"], max_level=2) 
            except Exception as e:
                print(e)
            
            # clean the data set
            airbnb_df['fields.city'] = airbnb_df['fields.city'].replace(to_replace='city', value='', regex=True)
            airbnb_df['fields.city'] = airbnb_df['fields.city'].replace(to_replace='county', value='', regex=True)
            airbnb_df['fields.city'] = airbnb_df['fields.city'].replace(to_replace='dc', value='', regex=True)
            airbnb_df['fields.city'] = airbnb_df['fields.city'].str.title()
            airbnb_df['fields.neighbourhood'] = airbnb_df['fields.neighbourhood'].str.title()

            # creates an connection object
            engine = create_engine(f'postgresql://{user}:{password}@localhost:5432/airbnb_db')

            # build the relationships from the database
            Base = automap_base()
            Base.prepare(engine, reflect=True)

            # map the class
            cities = Base.classes.top_airbnb_cities
            neighborhoods =  Base.classes.top_neighborhood_overview
            history_agg =  Base.classes.historical_insights


            #bind the session
            session = Session(bind=engine)

            # get the historical listings id
            historical_df = pd.DataFrame(session.query(history_agg.record_id))

            # get the cities, neighborhood, map class from the database SQL Map - could not access the bridge table
            cities_df = pd.DataFrame(session.query(cities.city_id, cities.city))
            city_nbh_df = pd.read_sql("select * from city_nbh", con=engine)
            neighborhood_df = pd.DataFrame(session.query(neighborhoods.nbh_id, neighborhoods.name, neighborhoods.county))
            neighborhood_df.head()

            #merge the data frame. 
            df_merge = pd.merge(cities_df, city_nbh_df, on='city_id')
            df_merge_table = pd.merge(df_merge, neighborhood_df, on='nbh_id')
            df_merge_table.head()


            historicalListings = []
            for index, row in cities_df.iterrows():
                filtered_df = airbnb_df[airbnb_df['fields.city'] == row['city']]
                # add neighborhood_id, city_id in the dataset
                for i, hist_agg in filtered_df.iterrows():
                    
                    # check if the record already exists
                    hist_df = historical_df[historical_df['record_id'] == hist_agg['recordid']]
                    if not hist_df.empty:
                        continue
                    
                    # get the nbh_id     
                    neighborhoods =  hist_agg['fields.neighbourhood'].split(',')
                    nbh_df = df_merge_table[(df_merge_table['city_id'] == row['city_id']) & (df_merge_table['name'].isin(neighborhoods))]
                    
                    if nbh_df.empty:
                        nbh_df =  df_merge_table[(df_merge_table['city_id'] == row['city_id']) & (df_merge_table['county'] == hist_agg['fields.neighbourhood'])]
                    nbh_id = None
                    if not nbh_df.empty:
                        nbh_id = nbh_df['nbh_id'].values[0] 
                        
                        
                    # build the dictionary
                    historical_dict = {
                        'record_id' : hist_agg['recordid'], 
                        'record_timestamp' : hist_agg['record_timestamp'],
                        'city_id' : row['city_id'],
                        'city' : hist_agg['fields.city'],        
                        'nbh_id': nbh_id,
                        'neighbourhood' : str(hist_agg['fields.neighbourhood']) , 
                        'country' : hist_agg['fields.country'],
                        'calculated_host_listings_count' : hist_agg['fields.calculated_host_listings_count'],
                        'reviews_per_month' : hist_agg['fields.reviews_per_month'],           
                        'price' : hist_agg['fields.price'], 
                        'geo_point_2d' : hist_agg['fields.geo_point_2d'], 
                        'aggregate_calculated_date' : hist_agg['fields.date'],
                        'number_of_rooms' : hist_agg['fields.number_of_rooms'], 
                        'availability_365' : hist_agg['fields.availability_365'], 
                        'room_type' :hist_agg['fields.room_type'] }
                    
                    # add to the list
                    historicalListings.append(historical_dict)


                    df_histAgg = pd.DataFrame(historicalListings)
                    df_histAgg.to_sql(name='historical_insights', con=engine, if_exists='append', index=False)

                    return "0"

    except Exception as ex :
        return null
    


# a method to pull all the data by city and neighbourbood
def AllHistoricalDataByCityandNeighborhood(city, neighbourhood):

     # creates an connection object
    engine = create_engine(f'postgresql://{user}:{password}@localhost:5432/airbnb_db')

    # build the relationships from the database
    Base = automap_base()
    Base.prepare(engine, reflect=True)

    # map the class
    cities = Base.classes.top_airbnb_cities
    neighborhoods =  Base.classes.top_neighborhood_overview
    history_agg =  Base.classes.historical_insights


    #bind the session
    session = Session(bind=engine)

    # get the historical listings id
    historical_df = pd.DataFrame(session.query(history_agg).filter(history_agg.id == city))




    return "0"
