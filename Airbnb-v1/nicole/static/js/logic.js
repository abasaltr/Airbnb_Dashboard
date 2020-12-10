// Store our API endpoint inside queryUrl
queryUrl="api/listingInfo";

  // reference :- https://leafletjs.com/examples/geojson/

// Perform a GET request to the query URL
d3.json("data/mash-api/120520/airbnb-listings-120520j.json", function(data) {
  

  var  = L.geoJSON(data.listingsInfo, {
    // make the markers circle
    pointToLayer: function (listings_data, coordinates) {
              return L.circleMarker(coordinates);
        } ,     
      // style the markers
      style: geojsonMarkerOptions,
      // add the popup feature for the points
    onEachFeature : addPopup
  });

  // create the map for earthquakes
  createMap(lisitigs);
});

// set the marker options 
function geojsonMarkerOptions(listings_data) {
    
  return {
   // radius of circle = magnitude, color = depth
    radius: listing_data.night_price,
    fillColor:GetColor(listing_data.cleaning_fee),
    color: "black",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
}

// Function that will determine the color based on the cleaning fee of the listing
function GetColor(cleaning_fee) {

    if(listings_data.cleaning_fee > 500){
        color = "red";
       }
   else if(listings_data.cleaning_fee > 250){
       color = "orange";
       }
   else if(listings_data.cleaning_fee > 100){
       color = "yellow";
       }  
   else if(listings_data.cleaning_fee > 50){
       color = "blue";
       }          
   else{
       color = "green"
       };

// Define a function 
function addPopup(listing_data, layer) {
  // Give each feature a popup describing the place and time of the earthquake
  return layer.bindPopup(`<h3> ${listings_data.airbnb_id} </h3> <hr> <p> ${NightPrice:(feature.properties.time)} </p>`);
}

// function to receive a layer of markers and plot them on a map.
function createMap(listings) {

  // Define outdoorMap and darkmap layers
  var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Outdoor Map": outdoorMap,
    "Dark Map": darkmap
  };

  // Create a layer control
  // Pass in our baseMaps a
  // Add the layer control to the map
  L.control.layers(baseMaps {
    collapsed: false
  }).addTo(myMap);

// Set up the legend
  var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        cleaning_array = [50, 100, 250, 500],
        labels = [];


    div.innerHTML += "<h3>CleaningFee</h3>"

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < cleaning_array.length; i++) {
        div.innerHTML +=
            '<p><i style="background:' + GetColor(cleaning_array[i] + 1) + '"></i> ' +
            cleaning_array[i] + (cleaning_array[i + 1] ? '&ndash;' + cleaning_array[i + 1] + '<br/>' : '+') +'</p>';
    }

    return div;
};

 // Adding legend to the map
 legend.addTo(myMap);


}