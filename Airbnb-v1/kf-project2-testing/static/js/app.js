
var dataFolder = "../static/data/";
var list_of_counties = [];
var skinny_overview = null;
var skinny_overview_neighborhood_id = null;
var skinny_overview_neighborhood_city = null;
var medium_overview_with_csv = null;

d3.json(dataFolder + "airbnb-city.json").then((airbnbcityjson) => {
    d3.json(dataFolder + "airbnb-id.json").then((airbnbidjson) => {
        d3.json(dataFolder + "airbnb-overview.json").then((airbnboverjson) => {
            d3.csv(dataFolder + "census.csv").then((censuscsv) => {
                // mapping 
                /*
                _log(censuscsv);
                _log(airbnbcityjson);
                _log(airbnbidjson);
                _log(airbnbnoverjson);
                */

                skinny_overview = airbnboverjson.map(mapAirBnBOverview);
                skinny_overview_neighborhood_id = mapAirBnBIdAndOverview(skinny_overview, airbnbidjson);
                skinny_overview_neighborhood_city = mapAirBnBwCity(skinny_overview_neighborhood_id, airbnbcityjson);
                medium_overview_with_csv = mapAirBnBCSV(skinny_overview_neighborhood_city, censuscsv);

                loadCities();
                updateNeighborhood($("#selCity").val());
                _log(list_of_counties);


            });
        });
    });

});



function loadCities() {
    var list_of_census_cities_distinct = [...new Set(medium_overview_with_csv.filter(obj => obj["TotalPop"] != undefined).map(obj => obj.city))];
    list_of_census_cities_distinct.sort().forEach(city => {
        $("#selCity").append($("<option>").text(city).val(city));
    });

}


function _log(data) {
    console.log(data);

}


function refreshSearch(cityChoice, neighborhoodChoice) {
    /* 
    Someone wants to search for a city with a neighborhood choice because they clicked the search button! 
    _log(cityChoice);
    _log(neighborhoodChoice);
    */
    $("#census_table").html(""); // must be blank after every search 
    var result = medium_overview_with_csv.filter(obj => obj["TotalPop"] != undefined && obj["city"] == cityChoice && obj["neighborhood_name"] == neighborhoodChoice);
    result = result[0];
    for (const key in result) {
        if (key != "airbnb_rental") { // && key != "unwanted key string"
            $("#census_table").append(`<tr><td>${key}</td> <td>${result[key]}</td></tr>`);
        }

    }



}

function updateNeighborhood(cityChoice) {
    var neighborhood = medium_overview_with_csv.filter(obj => obj["TotalPop"] != undefined && obj["city"] == cityChoice).map(obj => obj.neighborhood_name);
    $("#selNeighborhood").html($("<option>").text(neighborhood[0]).val(neighborhood[0]));
}

function dataCleansing(dataStr) {
    dataStr = dataStr.replace("County", '').trim();
    return dataStr;
}

/**
 * 
 * @param original_json_obj
 * this will return the id and the airbnb_rental 
 * {{status: "success", content: {…}, message: "Neighborhood bar fetched successfully"}
content: {id: "273471", name: "Dignowity Hill-St. Paul Square", city: "San Antonio", county: "Bexar", state: "TX", …}
message: "Neighborhood bar fetched successfully"
status: "success"

 */
function mapAirBnBOverview(original_json_obj) {
    var new_obj = {};
    new_obj.id = original_json_obj.content.id;
    new_obj.city = original_json_obj.content.city;
    new_obj.state = original_json_obj.content.state;
    new_obj.county = original_json_obj.content.county;
    new_obj.airbnb_rental = original_json_obj.content.airbnb_rental;

    if (list_of_counties.indexOf(new_obj.county) == -1) {
        list_of_counties.push(new_obj.county);
    }
    return new_obj;
}



/**
 * Goal is consolidate the 2 different jsons by connecting them by the neighborhood_id. This will add the neighbor name...
 * @param {*} modified_skinny_overview_json 
 * @param {*} original_ids_json 
 */
function mapAirBnBIdAndOverview(modified_skinny_overview_json, original_ids_json) {
    return modified_skinny_overview_json.map(obj => {
        let neighborhood_name = original_ids_json[obj.id].name;
        obj.neighborhood_name = neighborhood_name;
        return obj;
    });

}

/**
* Add listing information by connecting to city
 * @param {*} modified_skinny_overview_id_arr 
 * @param {*} original_city_json 
 */
function mapAirBnBwCity(modified_skinny_overview_id_arr, original_city_json) {

    return modified_skinny_overview_id_arr.map(obj => {
        var cityObj = original_city_json[obj.city];
        if (cityObj != undefined && cityObj.state.toLowerCase() == obj.state.toLowerCase()) {
            obj.occupancy = cityObj.occupancy;
            obj.total_listing = cityObj.total_listing;
            return obj;
        }
    });
}



function mapAirBnBCSV(modified_medium_overview_city_arr, original_csv_census) {

    return modified_medium_overview_city_arr.map(obj => {

        var countyToFind = obj.county;
        if (countyToFind == null || countyToFind == undefined) {
            // 
            return obj;
        } else {
            var result = original_csv_census.find(census_obj => {
                if (census_obj.County != undefined)
                    return dataCleansing(census_obj.County).toLowerCase() == dataCleansing(countyToFind).toLowerCase()
                else
                    return false;
            });
            if (result != undefined) {

                // columns to delete
                delete result[""];
                delete result["State"];
                delete result["County"];
                return { ...result, ...obj };
            } else {
                return obj;
            }
        }

    });
}