# Project III - Airbnb Dashboard

Group 6:
Katy Fuentes, Nicole Pipkins, Reza Abasaltian, Radhika Balasubramaniam

HEROKU Dashboard Deployment - 
https://airbnb-dashboard-g6.herokuapp.com/

Github Dashboard Deployment - version requires the execution of the Python Flask app: /Airbnb-v1/app.py on localhost:5000:
https://abasaltr.github.io/Airbnb_Dashboard/Airbnb-v1/index.html

## Installation Notes: 
PostgreSQL database username and password are required entries in file: /Airbnb-v1/db_key.py <br>
Heatmap visualization requires Mapbox API access token (https://account.mapbox.com/) key entries in file: /Airbnb-v1/static/js/config.js 

For database installation, run the sql script located at ![DataSetup](Airbnb-v1/Datasetup).  
Once the tables are created you can import the data in the folder to the tables at the ![data](Airbnb-v1/Datasetup/data) folder.  
The order and the mapping of files to tables for the import are  

  1. top_airbnb_cities --> top_airbnb_cities.csv  
  2. top_neighborhood_overview --> top_neighborhood_overview.csv  
  3. city_nbh --> city_nbh.csv
      

## Objective:
The Airbnb Dashboard provides guests fun interactive way to plan their vacation, and hosts a general idea about the airbnb market in the area
with a few key components in mind: 

### Guests  
	Can you get to where you’re planning by foot?  
	Will you be paying an arm and a leg for a cleaning fee?  
	And what kind of neighborhood is the listing in?  
	How much rental income do hosts generally make?  
	What are the rental rates in the area and other general statistics?  
	  
### Hosts  
        What are the rental rates in the area and other general statistics?  
	What is the investment score, income score and walkscore for the neighborhood?  
	Neighborhood facts  
	Compare nightly rates, nights booked and cleaning fees for each property type  
	Heat map analysis for the nights booked, reviews for the property listings  
	Average annual income realised for each property type  
	Average annual income vs occupancy for each property type  
	Average annual income vs occupancy for rental size  	


## Data Sources:
	https://rapidapi.com/ 
	https://www.mashvisor.com/data-methodology 
	https://www.census.gov/data/developers/updates/new-discovery-tool.html 
	https://www.kaggle.com/mikejohnsonjr/united-states-crime-rates-by-county
	https://public.opendatasoft.com/api/records/1.0/search/?dataset=airbnb-averages&q=&rows=1000&sort=date&facet=neighbourhood&facet=room_type&facet=number_of_rooms&facet=date&facet=location&refine.location=United+states
	


## Process:
	Using a compilation of Airbnb top cities, narrowed search by five states that included: Texas, New York, California, Florida, and District of Columbia. 
	
	Made 6 days of API data calls to obtain neighborhoods, neighborhood overview, rental rates, and listing information 
	Used census and crime statistic CSV files and merged data by condensed counties to integrate with the API information.
	
	Created a relational database "airbnb_db" on SQL.
		Tables include:
		city_nbh
		listings_info
		merged_census_crime
		neighborhood_insights
		neighborhood_overview
		rental_rates
		rental_rates_info
		top_airbnb_cities
		top_neighborhood_overview
		historical_insights
			
	
	Flask Routes:
		cities = "/api/cities"
		overview = "/api/nbh-overview"
		city_nbh = "/api/city-nbh"
		census_crime = "/api/census-crime"
		rental_income = "/api/income_change"
		crime_stats = "/api/crime_stats"
		top_nbh = "/api/top-nbh"
		map = "/map/<nbh_id>"
		heatmap = "/api/map/<nbh_id>"
		statistics = "/api/statistics/<city_id>/<nbh_id>"
		rental_size = "/api/rental_size/<city_id>/<nbh_id>"
		rental_type = "/api/rental_type/<city_id>/<nbh_id>"
		income_change = "/api/income_change"
		historical= "/api/historical/<city>/"
		houstonId = "api/getHoustonId
	
	Javascript files:


	HTML integration:


## Conclusion:    
The Airbnb Dashboard includes interactive visualizations and tables on the following:  

	-Walking score scale to assess if you can walk to places or plan for transportation. The scores include: 0-24 is Almost All Car-Dependent,  
	25-49 is Most Car-Dependent, 50-69 Somewhat Walkable, or 70-89 is Very Walkable.  
	-Map to detail the cleaning fees, nights booked, Airbnb listings with a summary of the listing. The leaf's represent total reviews.  
	-Cleaning Fees to review the associated cleaning fees by property listing. 
	-Return on investment compare rental income to home values and assess the potential return on owning an Airbnb in a certain city or neighborhood.  
	-Rental income to discover how much rental income hosts make in the listing area.  
	-Income by property type to evaluation.  
	-Demographics/Crime Data with a summary of population, income per capita, crime rate, demographics, and statistics by crime types.  
	-Rental statistics with average rental rates, nightly rates, cleaning fee, occupancy rates, Airbnb count, and review counts.  
	- Average annual income by property type    
	- Average income by property type vs occupancy  
	- Average income by Rental Size vs occupancy  
	
	





