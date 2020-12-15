// YOUR CODE HERE!
console.log('This is Airbnb-v1 leaflet js heatmap file - Project III');

// Adding tile layer
var streets = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Airbnb Project © <a href=\"https://www.rice.edu/\">Rice University</a> | Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 16,
    minZoom: 8,
    id: "streets-v11",
    accessToken: "pk.eyJ1IjoiYWJhc2FsdHIiLCJhIjoiY2tobnNuandvMDVubDJyb2E4a3F6bGRqZCJ9.csPDIivF_wOHiunkngsKig"
});

// Adding tile layer
var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Airbnb Project © <a href=\"https://www.rice.edu/\">Rice University</a> | Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 14,
    minZoom: 8,
    id: "light-v10",
    accessToken: "pk.eyJ1IjoiYWJhc2FsdHIiLCJhIjoiY2tobnNuandvMDVubDJyb2E4a3F6bGRqZCJ9.csPDIivF_wOHiunkngsKig"
});

// Adding tile layer
var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Airbnb Project © <a href=\"https://www.rice.edu/\">Rice University</a> | Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 14,
    minZoom: 8,
    id: "dark-v10",
    accessToken: "pk.eyJ1IjoiYWJhc2FsdHIiLCJhIjoiY2tobnNuandvMDVubDJyb2E4a3F6bGRqZCJ9.csPDIivF_wOHiunkngsKig"
});

// Adding tile layer
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Airbnb Project © <a href=\"https://www.rice.edu/\">Rice University</a> | Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 14,
    minZoom: 8,
    id: "satellite-v9",
    accessToken: "pk.eyJ1IjoiYWJhc2FsdHIiLCJhIjoiY2tobnNuandvMDVubDJyb2E4a3F6bGRqZCJ9.csPDIivF_wOHiunkngsKig"
});

// Adding tile layer
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Airbnb Project © <a href=\"https://www.rice.edu/\">Rice University</a> | Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 14,
    minZoom: 8,
    id: "outdoors-v11",
    accessToken: "pk.eyJ1IjoiYWJhc2FsdHIiLCJhIjoiY2tobnNuandvMDVubDJyb2E4a3F6bGRqZCJ9.csPDIivF_wOHiunkngsKig"
});


// Creating map object
var map = L.map("map", {
    center: [38.835224, -104.8198],
    zoom:  8,
    // default layers to have enabled
    layers: [streets]

});


// get the nbh_id from the url line
var url = window.location.href.split("map/");
var link = url[0] + "api/map/" + url[1];


// Fetch the Airbnb GeoJSON data and call function init() on application startup
var GeoJSON = [link];
var promises = [];
GeoJSON.forEach(function(url) {
    promises.push(d3.json(url))
});
Promise.all(promises).then(data => init(data));

// function to initialize data read and bridge between layers
function init(data) {

    //console.log(data[0][0]);

    var cleaningLayer = addCleaningFees(data[0][0]);
    var reviewLayer = addReviews(data[0][0]);

    var overlayMaps = {
        "Cleaning Fees": L.layerGroup(cleaningLayer[0]),
        "Nights Booked": L.layerGroup(reviewLayer),
        "Airbnb Listings": L.layerGroup(cleaningLayer[1])
    };
    // Only one base layer can be shown at a time
    var baseMaps = {
        "Light": light,
        "Dark": dark,
        "Outdoors": outdoors,
        "Satellite": satellite,
        "Streets": streets,
    };
    // Pass layers into the layer control and add the layer control to the map
    
    var nbh_center = [];
    for (x in cleaningLayer[1][0]){
        if (x == "_latlngs"){
            nbh_center.push(cleaningLayer[1][0][x]);
        }
    }
    
    var total_lat = 0;
    var total_lon = 0;
    nbh_center[0].forEach(value => {
        total_lat = total_lat + value[0];
        total_lon = total_lon + value[1];
    });

    var point = [total_lat/nbh_center[0].length, total_lon/nbh_center[0].length];

    var options = { collapsed: false };

    L.control.layers(baseMaps, overlayMaps, options).addTo(map);

    map.setView(point, 14, {animation: true});    


} //end init() function


// function adds cleaning fees layers to a list array and returns back to init()
// Size of the bubbles will be the price per night
// Color of the bubbles will be the range of cleaning fees
function addCleaningFees(data) {
  
    //console.log(data);
  
    var listings = []
    var lat = []
    var lon = []
    var property = []
    var cleaningFee = []
    var nightPrice = []
    var county = []
    var city = []
    var nbh_name = []
    var roomCount = []
    var maxCapacity = []
 
    for (x in data){
        //console.log(x);
        if (x == "airbnb_id"){
            listings.push(data[x]);
        }
        if (x == "lat"){
            lat.push(data[x]);
        }
        if (x == "lon"){
            lon.push(data[x]);
        }
        if (x == "property_type"){
            property.push(data[x]);
        }
        if (x == "cleaning_fee"){
            cleaningFee.push(data[x]);
        }
        if (x == "night_price"){
            nightPrice.push(data[x]);
        }
        if (x == "county"){
            county.push(data[x]);
        }
        if (x == "nbh_name"){
            nbh_name.push(data[x]);
        }
        if (x == "city"){
            city.push(data[x]);
        }
        if (x == "room_count"){
            roomCount.push(data[x]);
        }
        if (x == "max_capacity"){
            maxCapacity.push(data[x]);
        }
    }

    // create a marker heat array
    var heatArray = [];

    // Define a markerColor function that will give each earthquake a different color based on its depth
    function markerColor(depth_str) {
        var depth = parseFloat(depth_str);
        //console.log(depth);
        var color = "white";
        switch (true) {
            case (depth >= 0 && depth < 25):
                color = "lime";
                break;
            case (depth >= 25 && depth < 50):
                color = "#CCFF00";
                break;
            case (depth >= 50 && depth < 100):
                color = "#FFCC00";
                break;
            case (depth >= 100 && depth < 150):
                color = "#FF9900";
                break;
            case (depth >= 150 && depth < 250):
                color = "#FF6600";
                break;
            case (depth >= 250):
                color = "#BF0000";
                break;
            default:
                color = "lime";
                break;
        }
        //console.log(color);
        return color;
    }

    // Define a markerSize function that will give each earthquake a different radius based on its magnitude
    function markerSize(magnitude) {
        return parseInt(magnitude/2);
    }

    // initialize an earthquaker layer
    var eqLayer = [];

    // loop through each earthquake features and assign its coordinates
    for (var i=0; i < listings[0].length; i++) {
        // Add a new heat marker coordinates to the heat array 
        heatArray.push([lat[0][i], lon[0][i]]);
        eqLayer.push(L.circle([lat[0][i], lon[0][i]], {
                fillOpacity: 0.95,
                color: "grey",
                fillColor: markerColor(cleaningFee[0][i]),
                fillOpacity: 0.8,
                radius: markerSize(nightPrice[0][i])
        }).bindPopup(`<div class="popup"><h4>Property: ${property[0][i]}</h4><hr> 
        <h5>Nightly Price: $${parseFloat(nightPrice[0][i]).toFixed(2)} </h5> 
        <h5>Cleaning Fee: $${parseFloat(cleaningFee[0][i]).toFixed(2)} </h5>
        <h5>Total Rooms: ${parseInt(roomCount[0][i])} </h5>
        <h5>Maximum Capacity: ${parseInt(maxCapacity[0][i])} </h5>
        </div>`));
    };

    //add the marker heat array to the map
    var eqHeatLayer = [];
    eqHeatLayer.push(L.heatLayer(heatArray, {
        radius: 40,
        blur: 35
    }));

    // Set up the legend
    var legend = L.control({ position: "bottomright" });

    

    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");

        div.innerHTML = 'Cleaning Fees<br>';

        var limits = ["$0—25", "$25—50", "$50—100", "$100—150", "$150—250", "$250+"];
        var colors = ["lime", "#CCFF00", "#FFCC00", "#FF9900", "#FF6600", "#BF0000"];
        var labels = [];

        limits.forEach(function (limit, index) {
            labels.push(`<div class="square" style="background-color:${colors[index]}">
            <h5>${limit}</h5></div>`);
        });

        div.innerHTML += labels.join('');
        return div;
    };


    // Set up the legend
    var maptitle = L.control({ position: "topleft" });
    maptitle.onAdd = function (map) {
        var div = L.DomUtil.create("div", "maptitle");
        var labels = [  'City: ' + city[0][0] + '<br>' + 
                        'County: ' + county[0][0] + '<br>' + 
                        'Neighborhood: ' + nbh_name[0][0] + '<br>' +
                        'Total Properties:' + listings[0].length];

        div.innerHTML += labels.join('');
        return div;
    };

    // Adding legend to the map
    legend.addTo(map);
    maptitle.addTo(map);
    
    var cleaningLayers = [];
    cleaningLayers.push(eqLayer);
    cleaningLayers.push(eqHeatLayer);

    return cleaningLayers;
}; //end addCleaningFees()


// function adds airbnb review layers to a list array and returns back to init()
// Size of the leaf will be the total reviews
// Color of the leaf will be the star rating
function addReviews(data) {
  
    //console.log(data);
  
    var listings = []
    var lat = []
    var lon = []
    var property = []
    var nightsBooked = []
    var totalReviews = []
    var county = []
    var city = []
    var nbh_name = []
    var rentalIncome = []
    var starRating = []
 
    for (x in data){
        //console.log(x);
        if (x == "airbnb_id"){
            listings.push(data[x]);
        }
        if (x == "lat"){
            lat.push(data[x]);
        }
        if (x == "lon"){
            lon.push(data[x]);
        }
        if (x == "property_type"){
            property.push(data[x]);
        }
        if (x == "nights_booked"){
            nightsBooked.push(data[x]);
        }
        if (x == "total_reviews"){
            totalReviews.push(data[x]);
        }
        if (x == "star_rating"){
            starRating.push(data[x]);
        }
        if (x == "rental_income"){
            rentalIncome.push(data[x]);
        }
    }

    // Define a markerSize function that will give each earthquake a different radius based on its magnitude
    function leafSize(reviews) {
        return parseInt(reviews*0.16);
    }

    var leafLayers = [];
    // loop through each earthquake features and assign its coordinates
    for (var i=0; i < listings[0].length; i++) {

        size = leafSize(totalReviews[0][i]);
        
        var LeafIcon = L.Icon.extend({
            options: {
                shadowUrl: '../static/images/leaf-shadow.png',
                iconSize:     [38+size, 95+size], // size of the icon in pixels [width, height]
                shadowSize:   [50+(parseInt(size/2)), 64+(parseInt(size/2))], // size of the shadow
                iconAnchor:   [22+(parseInt(size*0.65)), 94+size], // point of the icon which will correspond to marker's location [+ left, + up]
                shadowAnchor: [4+(parseInt(size*0.05)), 62+(parseInt(size/2))], // the same for the shadow
                popupAnchor:  [-3, -76-parseInt(size/1.5)] // point from which the popup should open relative to the iconAnchor
            }
        });

        var greenIcon = new LeafIcon({iconUrl: '../static/images/leaf-green.png'}),
            redIcon = new LeafIcon({iconUrl: '../static/images/leaf-red.png'}),
            orangeIcon = new LeafIcon({iconUrl: '../static/images/leaf-orange.png'});

        L.icon = function (options) {
            return new L.Icon(options);
        };

        if (nightsBooked[0][i] > 245){
            leafLayers.push(L.marker([lat[0][i], lon[0][i]], {icon: greenIcon}).bindPopup(
                `<div class="popup"><h4>Property: ${property[0][i]}</h4><hr> 
                <h5>Total Reviews: ${parseInt(totalReviews[0][i])} </h5> 
                <h5>Nights Booked: ${parseInt(nightsBooked[0][i])} </h5>
                <h5>Star Rating: ${parseInt(starRating[0][i])} </h5>
                <h5>Rental Income: $${parseInt(rentalIncome[0][i])} </h5>
                </div>`));
        }
        else if (nightsBooked[0][i] > 125){
            leafLayers.push(L.marker([lat[0][i], lon[0][i]], {icon: orangeIcon}).bindPopup(
                `<div class="popup"><h4>Property: ${property[0][i]}</h4><hr> 
                <h5>Total Reviews: ${parseInt(totalReviews[0][i])} </h5> 
                <h5>Nights Booked: ${parseInt(nightsBooked[0][i])} </h5>
                <h5>Star Rating: ${parseInt(starRating[0][i])} </h5>
                <h5>Rental Income: $${parseInt(rentalIncome[0][i])} </h5>
                </div>`));
        }
        else if (nightsBooked[0][i] > 2){
            leafLayers.push(L.marker([lat[0][i], lon[0][i]], {icon: redIcon}).bindPopup(
                `<div class="popup"><h4>Property: ${property[0][i]}</h4><hr> 
                <h5>Total Reviews: ${parseInt(totalReviews[0][i])} </h5> 
                <h5>Nights Booked: ${parseInt(nightsBooked[0][i])} </h5>
                <h5>Star Rating: ${parseInt(starRating[0][i])} </h5>
                <h5>Rental Income: $${parseInt(rentalIncome[0][i])} </h5>
                </div>`));
        }
        
    }

    // Set up the legend
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legendLeaf");
        var limits = ["2—125", "125—245", "245—365"];
        var labels = ['../static/images/leaf-red-l.png', '../static/images/leaf-orange-l.png','../static/images/leaf-green-l.png'];

        div.innerHTML = 'Nights Booked<br>';

        for (var i = 0; i < limits.length; i++) {
            div.innerHTML +=
                limits[i] + (" <img src="+ labels[i] +" height='20' width='20'>") +'<br>';
        }

        return div;
    };

    // Adding legend to the map
    legend.addTo(map);

    return leafLayers;
}
