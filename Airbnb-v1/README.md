# Project II - Airbnb Dashboard

Group 6:
Katy Fuentes, Nicole Pipkins, Reza Abasaltian, Radhika Balasubramaniam

Repo:
https://github.com/abasaltr/Airbnb_Dashboard 

## Objective:
The Airbnb Dashboard provides guests a fun interactive way to plan their vacation, 
with a few key components in mind: 
	Can you get to where you’re planning by foot?
	Will you be paying an arm and a leg for a cleaning fee?
	And what kind of neighborhood is the listing in?
	How much rental income do hosts generally make?
	What are the rental rates in the area and other general statistics?
	


## Data Sources:
	https://rapidapi.com/ 
	https://www.mashvisor.com/data-methodology 
	https://www.census.gov/data/developers/updates/new-discovery-tool.html 
	https://www.kaggle.com/mikejohnsonjr/united-states-crime-rates-by-county


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
	
	





