// PROJECT CODE HERE!
console.log('This is the Airbnb-v1 dashboard js file');

// Fetch the JSON data and call function init()
var url_cities = "/api/cities";
var url_overview = "/api/nbh-overview";
var urls = [url_cities, url_overview];
var promises = [];
urls.forEach(function (url) { promises.push(d3.json(url)) });
Promise.all(promises).then(data => init(data));
// end JSON Fetch

// function addCities
function addCities(response) {
    var cities = response;
    initDropList(cities[0]);

}//end addCities() function

// functon addNbhOverview
function addNbhOverview(response) {
    var overview = response;
    //console.log(overview);
}//end addNbhOverview() function

// function init
function init(data) {
    var citiesIn = addCities(data[0]);
    var overviewIn = addNbhOverview(data[1]);
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