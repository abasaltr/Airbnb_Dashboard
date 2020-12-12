Create table historical_insights (
 record_id character varying(100), 
 record_timestamp Date,
 city_id integer,
 city character varying(30),  
 nbh_id integer,
 neighbourhood character varying(1000) ,
 country character varying(30),
 calculated_host_listings_count numeric,
 reviews_per_month numeric, 
 price numeric, 
 geo_point_2d character varying(100) , 
 aggregate_calculated_date date,
 number_of_rooms numeric, 
 availability_365 numeric, 
 room_type  character varying(30),
  CONSTRAINT pk_historical_insights PRIMARY KEY (record_id),
  CONSTRAINT fk_historical_insights_city_id FOREIGN KEY (city_id)
        REFERENCES public.top_airbnb_cities (city_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_historical_insights_nbh_id FOREIGN KEY (nbh_id)
        REFERENCES public.top_neighborhood_overview (nbh_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)