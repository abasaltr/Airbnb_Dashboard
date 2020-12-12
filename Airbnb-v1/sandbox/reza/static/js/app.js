// PROJECT CODE HERE!
console.log('This is the Airbnb-v1 dashboard js file');

//declate global variables
var citiesIn = [];
var overviewIn = [];
var cityNbhIn = [];
var topNbhIn = [];

// Fetch the JSON data and call function init()
var url_cities = "/api/cities";
var url_overview = "/api/nbh-overview";
var url_city_nbh = "/api/city-nbh";
var url_top_nbh = "/api/top-nbh";
var urls = [url_cities, url_overview, url_city_nbh, url_top_nbh];
var promises = [];
urls.forEach(function (url) { promises.push(d3.json(url)) });
console.log(promises);
Promise.all(promises).then(data => init(data));
// end JSON Fetch

// add event listener to the heatmap button
d3.select("#heatbtn").on("click", function(){
    // Use D3 to select the dropdown menu value
    var nbh_id = getTopNbhId(d3.select('#selNeighborhood option:checked').text());
    window.open("/map/" + nbh_id);    
})

// function addCities
function addCities(response) {
    var cities = response;
    initDropList(cities[0]);
    return cities;
}//end addCities() function

// functon addNbhOverview
function addNbhOverview(response) {
    var overview = response;
    buildGauge(response[0],0);
    return overview;
}//end addNbhOverview() function

// function addCities
function addCityNbh(response) {
    var city_nbh = response;
    return city_nbh;
}//end addCities() function

// function addTopNbh
function addTopNbh(response) {
    var top_nbh = response;
    return top_nbh;
}//end addTopNbh() function


// function init
function init(data) {
    citiesIn = addCities(data[0]);
    overviewIn = addNbhOverview(data[1]);
    cityNbhIn = addCityNbh(data[2]);
    topNbhIn = addTopNbh(data[3]);
}//end init() function


// function on application startup to initialize dropdown menu options to placeholder text values,
// calls function that populates each filter criteria with tableData values assigned from data.js 
function initDropList(cityData) {

    var uniqueCity = [...new Set(Object.values(cityData['city']))];
    var nbh_name = Object.values(cityData['nbh_name']);

    // call function to populate the form dropdown menu options for each filter criteria in alphabetical order
    createDropList(uniqueCity, "selCity", "Select City", 2);
    createDropList(nbh_name, "selNeighborhood", "Select Neighborhood", 2);
    
}//initDropList() function


// function to populate the form dropdown menu options for each filter criteria in alphabetical order
// passing parameters include the filter array list, html tag select name (placeholder text string), 
// html tag select id name, and select option type
// the select option type is used for formatting purpose as defined numerical value below:
// 1. date formatted the same as is retrieved from tableData
// 2. full text string formatted as first character is in upper case
// 3. partial text abbreviation string formatted as all characters are in upper case
function createDropList(menu, selectname, idname, sType) {

    // check if option type passed is date or string as defined by its numerical value
    if (sType == 1) {
        // assigned only unique data values of the array list without any duplicates, but unsorted for date options 
        var sort_values = menu.filter((e, i, a) => a.indexOf(e) === i);
    }
    else {
        // assigned only unique data values of the array list without any duplicates, 
        // and sorted alphabetically for string options 
        var sort_values = menu.filter((e, i, a) => a.indexOf(e) === i).sort();
    }

    // define a constant statement to append a string at the beginning of an array list
    // do not modify this value during scripts execution
    // used for adding placeholder value on top of the menu options as default value
    // assign result to list array of data values 
    const addElementToBeginningOfArray = (a, e) => [e, ...a]
    values = addElementToBeginningOfArray(sort_values, idname);

    // createElement() method creates an Element Node with the specified name.
    // create html select tag assigning name and id to the select parameters passed
    //var select = document.createElement("select");
    var select = document.getElementById(selectname)
    //select.name = selectname;
    //select.id = idname;

    // loop through contents of data values to format how its displayed and set its placeholder values as selected
    for (const val of values) {

        // create html option tag that will be appended within the select tag
        var option = document.createElement("option");
        // assign option value to each data value iteratively
        option.value = val;

        // check if option type is date, displayed as is and 
        // option selected is set to true for placeholder text string
        if (sType == 1) {
            option.text = val;
            if (val == selectname) {
                option.selected = true;
            }
        }

        // check if option type is full text string, display initial character in upper case and 
        // option selected is set to true for placeholder text string
        if (sType == 2) {
            option.text = val.charAt(0).toUpperCase() + val.slice(1);
            if (val == selectname) {
                option.selected = true;
            }
        }

        // check if option type is partial text string abbreviation, display all characters in upper case and
        // option selected is set to true for placeholder text string
        if (sType == 3) {
            if (val == selectname) {
                option.selected = true;
                option.text = val.charAt(0).toUpperCase() + val.slice(1);
            }
            else {
                option.text = val.charAt(0).toUpperCase() + val.charAt(1).toUpperCase();
            }
        }

        // append the html option tag within the html select tag using appendChild() method
        // method to append a node as the last child of a node passing in text value assigned above
        // appendChild() moves from its current position to the new position
        select.appendChild(option);
    }
}//end createDropList() function

// getNbhIndex function
function getNbhIndex(name){
    indexName = 0
    for (i = 0; i < overviewIn[0]['nbh_name'].length; i++) {
        if (name == overviewIn[0]['nbh_name'][i]){
            indexName = i;
        }
    }
    return indexName;
}

// getTopNbhId function
function getTopNbhId(name){
    nbh_id = 0
    for (i = 0; i < topNbhIn[0]['name'].length; i++) {
        if (name == topNbhIn[0]['name'][i]){
            nbh_id = parseInt(topNbhIn[0]['nbh_id'][i]);
        }
    }
    return nbh_id;
}

// getNbhIndexId function
function getNbhIndexId(id){
    //console.log(overviewIn);
    indexId = 0
    for (i = 0; i < overviewIn[0]['nbh_id'].length; i++) {
        if (id == overviewIn[0]['nbh_id'][i]){
            indexId = i;
        }
    }
    return indexId;
}

// getCityNbh function
function getCityNbh(name){
    city_id = 0
    nbh_id = 0
    for (i = 0; i < citiesIn[0]['city'].length; i++) {
        if (name == citiesIn[0]['city'][i]){
            city_id = parseInt(citiesIn[0]['city_id'][i]);
            break;
        }
    }

    for (i = 0; i < cityNbhIn[0]['city_id'].length; i++) {
        if (city_id == parseInt(cityNbhIn[0]['city_id'][i])){
            nbh_id = parseInt(cityNbhIn[0]['nbh_id'][i]);
            break;
        }
    }
    return nbh_id;
}

// from html 
function changeNbh(nbh_name) {
    removeWalkScore();
    var nbh_index = getNbhIndex(nbh_name);
    buildGauge(overviewIn[0], nbh_index);
}

// from html 
function changeCity(city_name) {
    removeWalkScore();
    var nbh_id = getCityNbh(city_name);
    var nbh_index = getNbhIndexId(nbh_id)
    buildGauge(overviewIn[0], nbh_index);
}

// clear walking score visualization
function removeWalkScore() {
    d3.select("walkscore").selectAll("div").remove();
}

function buildGauge(nbh_ovw,nbh_index) {
    var walkscore = Object.values(nbh_ovw['walkscore']);
    var nbh_id = Object.values(nbh_ovw['nbh_id']);

    var trace1 = {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseInt(walkscore[nbh_index]),
        title: { text: "", font: { family: "Arial", size: 14, color: "#337AB7" } },
        type: "indicator",
        mode: "gauge+delta",
        delta: { reference: 0, increasing: { color: "darkblue" }, font: { size: 18 } },
        gauge: {
            axis: { range: [10, 100], tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            steps: [
                { range: [0, 10], color: "#FF8080" },
                { range: [11, 20], color: "red" },
                { range: [20, 30], color: "BF0000" },
                { range: [30, 40], color: "#FF6600" },
                { range: [40, 50], color: "#FF9900" },
                { range: [50, 60], color: "#FFCC00" },
                { range: [60, 70], color: "#FFFF00" },
                { range: [70, 80], color: "#FFFF99" },
                { range: [80, 90], color: "#CCFF00" },
                { range: [90, 100], color: "lime" }
            ]
        }
    }
    
    var data = [trace1];
    var layout = {
        font: { family: "Arial", size: 12, color: "#337AB7" }, width: 275, height: 125, margin: { t: 0, b: 0 }, plot_bgcolor: "azure",
        paper_bgcolor: "azure"
    };
    Plotly.newPlot('walkScore', data, layout);
}