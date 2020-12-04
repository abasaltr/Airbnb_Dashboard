-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/sGUqmz
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "listings_info" (
    "airbnb_id" integer   NOT NULL,
    "nbh_id" integer   NOT NULL,
    "url" string   NOT NULL,
    "lat" integer   NOT NULL,
    "lon" integer   NOT NULL,
    "city" varchar(30)   NOT NULL,
    "state" varchar(2)   NOT NULL,
    "night_price" integer   NOT NULL,
    "cleaning_fee" integer   NOT NULL,
    "nights_booked" integer   NOT NULL,
    "rental_income" integer   NOT NULL,
    "property_type" string   NOT NULL,
    "room_count" integer   NOT NULL,
    "bed_count" integer   NOT NULL,
    "star_rating" integer   NOT NULL,
    "total_reviews" integer   NOT NULL
);

CREATE TABLE "top_airbnb_cities" (
    "cityid" int   NOT NULL,
    "city" string   NOT NULL,
    "state" varchar(2)   NOT NULL,
    "occupancy" integer   NOT NULL,
    "total_listing" integer   NOT NULL,
    CONSTRAINT "pk_top_airbnb_cities" PRIMARY KEY (
        "cityid"
     )
);

CREATE TABLE "neighborhood_overview" (
    "nbh_id" int   NOT NULL,
    "latitude" integer   NOT NULL,
    "longitude" integer   NOT NULL,
    "walkscore" integer   NOT NULL,
    "airbnb_count" integer   NOT NULL,
    "other_count" integer   NOT NULL,
    "avg_occupancy" integer   NOT NULL,
    "median_price" integer   NOT NULL,
    "sqft_price" integer   NOT NULL,
    "anbbrental_roi" integer   NOT NULL,
    "anbbbrental_rental_income" integer   NOT NULL,
    "anbbrental_night_price" integer   NOT NULL,
    "anbbrental_change_percentage" integer   NOT NULL,
    "rental_income_change" string   NOT NULL
);

CREATE TABLE "top_neighborhood_overview" (
    "nbh_id" int   NOT NULL,
    "name" varchar(30)   NOT NULL,
    "cityid" int   NOT NULL,
    "county" varchar(30)   NOT NULL,
    "state" varchar(2)   NOT NULL
);

CREATE TABLE "neighborhood_insights" (
    "nbh_id" int   NOT NULL,
    "i.bedrm_slope" int   NOT NULL,
    "i.bedrm_rsquare" int   NOT NULL,
    "i.price_slope" int   NOT NULL,
    "i.price_rsquare" int   NOT NULL,
    "i.stars_rate_slope" int   NOT NULL,
    "i.stars_rate_rsquare" int   NOT NULL,
    "i.bathrms_slope" int   NOT NULL,
    "i.bathrms_rsquare" int   NOT NULL,
    "i.beds_slope" int   NOT NULL,
    "i.beds_rsquare" int   NOT NULL,
    "i.reviews_count_slope" int   NOT NULL,
    "i.reviews_count_rsquare" int   NOT NULL
);

CREATE TABLE "rental_rates" (
    "nbh_id" int   NOT NULL,
    "studio" int   NOT NULL,
    "one_room" int   NOT NULL,
    "two_room" int   NOT NULL,
    "three_room" int   NOT NULL,
    "four_room" int   NOT NULL,
    "sample_count" int   NOT NULL
);

ALTER TABLE "listings_info" ADD CONSTRAINT "fk_listings_info_nbh_id" FOREIGN KEY("nbh_id")
REFERENCES "neighborhood_overview" ("nbh_id");

ALTER TABLE "neighborhood_overview" ADD CONSTRAINT "fk_neighborhood_overview_nbh_id" FOREIGN KEY("nbh_id")
REFERENCES "top_neighborhood_overview" ("nbh_id");

ALTER TABLE "top_neighborhood_overview" ADD CONSTRAINT "fk_top_neighborhood_overview_cityid" FOREIGN KEY("cityid")
REFERENCES "top_airbnb_cities" ("cityid");

ALTER TABLE "neighborhood_insights" ADD CONSTRAINT "fk_neighborhood_insights_nbh_id" FOREIGN KEY("nbh_id")
REFERENCES "listings_info" ("nbh_id");

ALTER TABLE "rental_rates" ADD CONSTRAINT "fk_rental_rates_nbh_id" FOREIGN KEY("nbh_id")
REFERENCES "top_neighborhood_overview" ("nbh_id");

