// YOUR CODE HERE!
console.log('This is Airbnb-v1 leaflet js map file - Reza Abasaltian');

// Adding tile layer
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    //attribution: "Airbnb Heatmap © <a href=\"https://www.rice.edu/\">Rice University</a> | Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    id: "outdoors-v11",
    accessToken: API_KEY
});

// Creating map object
var map = L.map("heatMap", {
    center: [38.835224, -104.8198],
    zoom: 14,
    attributionControl: false,
    // default layers to have enabled
    layers: [outdoors]
});

// Load in geojson data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the USGS Earthquakes GeoJSON data and call function init() on application startup
// Fetch the Tectonic Plates GeoJSON data and call function init() on application startup
var GeoJSON = [link];
var promises = [];
GeoJSON.forEach(function(url) {
    promises.push(d3.json(url))
});
console.log(promises);
Promise.all(promises).then(data => initHeat(data));

// function to initialize data read and bridge between layers
function initHeat(data) {
    
    var marker = L.marker([38.845224, -104.8198]).addTo(map);

    map.dragging.disable();
    map.removeControl(map.zoomControl);
    map.scrollWheelZoom.disable();
    
} //end init() function
