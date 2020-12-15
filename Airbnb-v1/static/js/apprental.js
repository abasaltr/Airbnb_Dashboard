// PROJECT CODE HERE!
console.log('This is the Airbnb-v1 dashboard js file');

//declate global variables
var citiesIn = [];

// Fetch the JSON data and call function init()
var url_cities = "/api/cities";
//var url_houston = "/api/getHoustonId"
var urls = [url_cities];

var promises = [];
urls.forEach(function (url) { promises.push(d3.json(url)) });
console.log(promises);
Promise.all(promises).then(data => init(data));
// end JSON Fetch


// function addCities
function addCities(response) {
    var cities = response;    
    initDropList(cities[0]);  
    return cities;
}//end addCities() function


// function init
function init(data) {
    citiesIn = addCities(data[0]);
   
    d3.select('#selCity').property('value', 28719);
    d3.select("#heading").text("Houston")
    updateNeighborhoods(28719)
}//end init() function


// function on application startup to initialize dropdown menu options to placeholder text values,
// calls function that populates each filter criteria with tableData values assigned from data.js 
function initDropList(cityData) {

    var uniqueCity = [...new Set(Object.values(cityData['city']))];
    var nbh_name = Object.values(cityData['nbh_name']);

    var city_table = [
        {
             "id" : ["selCity", ...new Set(Object.values(cityData['city_id']))], 
             "name" : ["Select City", ...new Set(Object.values(cityData['city']))]
        }];
      
    var nbh_table = [
        {
            "id" : ["selNbh", ...new Set(Object.values(cityData['nbh_id']))], 
            "name" : ["Select Neighborhood",...new Set(Object.values(cityData['nbh_name']))]
        }];
    // call function to populate the form dropdown menu options for each filter criteria in alphabetical order
    createDropList(city_table, "selCity", "Select City")
    createDropList(nbh_table, "selNeighborhood","Select Neighborhood")
}//initDropList() function


// function to create the droplist for the cities and neighborhoods
function createDropList(menu, selectname, idname)
{ 
    //d3.select("#" + selectname).select("options").remove();
    var select = document.getElementById(selectname)
   
    idtxt = (menu[0]['id']).toString();
    ids = idtxt.split(",");

    nametxt = (menu[0]['name']).toString();
    names = nametxt.split(",");
 
    for (i = 0; i < ids.length; i++)
    {
        // create html option tag that will be appended within the select tag
        var option = document.createElement("option");
        // assign option value to each data value iteratively
        option.value = ids[i];
        option.text = names[i];
        select.appendChild(option);        
    }  
}

// An event handler for the neighborhood drop down. Call the functions to generate charts 
function changeNbh(nbh_id) {
   
    name = d3.select('#selCity option:checked').text();
    nbh_name = d3.select('#selNeighborhood option:checked').text();
    if (name != null) 
    {
        name = (name.concat(", ")).concat(nbh_name)
    }
    else 
    {
        name = nbh_name
    }
    d3.select("#heading").text(name)
    BuildRentalIncomeVsOccupancyChartForRentalSize("0",nbh_id);
    rentalTypeChart("0",nbh_id);
    BuildRental_incomeChart("0", nbh_id)
    //BuildRentalVsOccupancyChartForRentalType("0", nbh_id)
}

//******************* */
// change neighborhoods based on the city_id, call the functions to generate charts
function changeCity(city_id) 
{
    updateNeighborhoods(city_id);
    city_name = d3.select('#selCity option:checked').text();     
    d3.select("#heading").text(city_name);
    BuildRentalIncomeVsOccupancyChartForRentalSize(city_id,"0");
    rentalTypeChart(city_id, "0");
    BuildRental_incomeChart(city_id, "0")
    //BuildRentalVsOccupancyChartForRentalType(city_id,"0")
}
//******************* */

// a function to add commas to the number
function addCommas(number) {
    number += '';
    var x = number.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}


//******************** */
// update the neighborhoods based on the selection
function updateNeighborhoods(city_id) {

    var nbh_table = []

    ids = ["selNbh"];
    names = ["Select Neighborhood"];

    for (i = 0; i < citiesIn[0]['nbh_id'].length; i++) {
        if (city_id == citiesIn[0]['city_id'][i]) {
            ids.push(citiesIn[0]['nbh_id'][i])
            names.push(citiesIn[0]['nbh_name'][i])
        }
    }

    dict = {
        "id" :  ids,
        "name" : names
    }
    nbh_table.push(dict)

   d3.select("#selNeighborhood").selectAll("option").remove()
   createDropList(nbh_table, "selNeighborhood", "Select Neighborhood");
}
//******************* */

