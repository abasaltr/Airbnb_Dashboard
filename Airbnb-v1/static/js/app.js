// PROJECT CODE HERE!
console.log('This is the Airbnb-v1 dashboard js file');

//declate global variables
var citiesIn = [];
var overviewIn = [];
var cityNbhIn = [];
var censusCrimeIn = [];
var rentalIncomeIn = [];
var crimeStatsIn = [];
var topNbhIn = [];

// Fetch the JSON data and call function init()
var url_cities = "/api/cities";
var url_overview = "/api/nbh-overview";
var url_city_nbh = "/api/city-nbh";
var url_census_crime = "/api/census-crime"
var url_rental_income = "/api/income_change"
var url_crime_stats = "/api/crime_stats"
var url_top_nbh = "/api/top-nbh";
var urls = [url_cities, url_overview, url_city_nbh, url_census_crime, url_rental_income, url_crime_stats, url_top_nbh];

var promises = [];
urls.forEach(function (url) { promises.push(d3.json(url)) });
console.log(promises);
Promise.all(promises).then(data => init(data));
// end JSON Fetch


// add event listener to the heatmap button
d3.select("#heatbtn").on("click", function () {
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
    buildGauge(response[0], 31);
    return overview;
}//end addNbhOverview() function

// function addCities
function addCityNbh(response) {
    var city_nbh = response;
    return city_nbh;
}//end addCities() function

// function addCensusCrime
function addCensusCrime(response) {
    var census_crime = response;

    return census_crime;
}//end addCensusCrime() function

function addCrimeStats(response) {
    var crime_stats = response;

    return crime_stats;

}//end addCities() function


// function addTopNbh
function addTopNbh(response) {
    var top_nbh = response;
    return top_nbh;
}//end addTopNbh() function


function addRentalIncome(response) {
    var cities = response;
    buildBulletIncome(response[0], 271298);
    return cities;
}//end addRentalIncome() function




// function init
function init(data) {
    citiesIn = addCities(data[0]);
    overviewIn = addNbhOverview(data[1]);
    cityNbhIn = addCityNbh(data[2]);
    censusCrimeIn = addCensusCrime(data[3]);
    rentalIncomeIn = addRentalIncome(data[4]);
    crimeStatsIn = addCrimeStats(data[5]);
    topNbhIn = addTopNbh(data[6]);
    createCensusPanel(censusCrimeIn[0], overviewIn[0], 271298);
    createCrimeTable(crimeStatsIn[0], overviewIn[0], 274853);
    d3.select('#selCity').property('value', 'Houston');
    d3.select("#heading").text("Houston")
    updateNeighborhoods("Houston")
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

function getNbhIndex(name) {
    indexName = 0
    for (i = 0; i < overviewIn[0]['nbh_name'].length; i++) {
        if (name == overviewIn[0]['nbh_name'][i]) {
            indexName = i;
        }
    }
    return indexName;
}

// getNbhIndexId function
function getNbhIndexId(id) {
    //console.log(overviewIn);
    indexId = 0
    for (i = 0; i < overviewIn[0]['nbh_id'].length; i++) {
        if (id == overviewIn[0]['nbh_id'][i]) {
            indexId = i;
        }
    }
    return indexId;
}

// getCityNbh function
function getCityNbh(name) {
    city_id = 0
    nbh_id = 0
    for (i = 0; i < citiesIn[0]['city'].length; i++) {
        if (name == citiesIn[0]['city'][i]) {
            city_id = parseInt(citiesIn[0]['city_id'][i]);
            break;
        }
    }

    for (i = 0; i < cityNbhIn[0]['city_id'].length; i++) {
        if (city_id == parseInt(cityNbhIn[0]['city_id'][i])) {
            nbh_id = parseInt(cityNbhIn[0]['nbh_id'][i]);
            break;
        }
    }
    return nbh_id;
}

// getCityId function
function getCityId(name) {
    city_id = 0
    nbh_id = 0
    for (i = 0; i < citiesIn[0]['city'].length; i++) {
        if (name == citiesIn[0]['city'][i]) {
            city_id = parseInt(citiesIn[0]['city_id'][i]);
            break;
        }
    }
    return city_id;
}

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

//function to ease data cleaning into 2 decimals
function decimalRound(number) {
    var formatInteger = d3.format(",");
    var formatDecimal = d3.format(",.2f");

    var number1 = 10101;
    var number2 = 12334.2;
    return !(number % 1) ? formatInteger(number) : formatDecimal(number)
}

function createCensusPanel(censusData, nbhData, nbh_id) {

    d3.select("#demographic").selectAll("div").remove();
    d3.select("#population").selectAll("div").remove();
    d3.select("#capita").selectAll("div").remove();
    d3.select("#crime").selectAll("div").remove();

    let table = d3.select("#demographic").append('table').attr('class', 'table table-striped')
    let header = table.append('thead')
    let headers = ['Hispanic', 'White', 'Black', 'Native', 'Asian', 'Pacific']
    headers.forEach(function (d) {
        let colHeader = header.append('th')
        colHeader.text(d)
    })

    for (i = 0; i < censusData['nbh_id'].length; i++) {
        if (nbh_id == parseInt(censusData['nbh_id'][i])) {
            console.log(censusData["total_pop"][i]);

            d3.select("#population").text(addCommas(censusData["total_pop"][i]));
            d3.select("#capita").text(addCommas(censusData["income_cap"][i]));
            d3.select("#crime").text(decimalRound(censusData["crime_rate"][i]));

            tblElement = "<table><tr>";
            tblElement = tblElement + "<th>Hispanic</th>" + "<th>White</th>" + "<th>Black</th>" + "<th>Native</th>" + "<th>Asian</th>" + "<th>Pacific</th>";
            tblElement = tblElement + "</tr></table>"

            var row = table.append('tr')
            let hisp_row = row.append('td')
            let white_row = row.append('td')
            let black_row = row.append('td')
            let native_row = row.append('td')
            let asian_row = row.append('td')
            let pacific_row = row.append('td')

            hisp_row.text(censusData["demo_Hispanic"][i])
            white_row.text(censusData["demo_White"][i])
            black_row.text(censusData["demo_Black"][i])
            native_row.text(censusData["demo_Native"][i])
            asian_row.text(censusData["demo_Asian"][i])
            pacific_row.text(censusData["demo_Pacific"][i])

        }
    }


}


// getTopNbhId function
function getTopNbhId(name) {
    nbh_id = 0
    console.log(topNbhIn[0]['name'])
    for (i = 0; i < topNbhIn[0]['name'].length; i++) {
        if (name == topNbhIn[0]['name'][i]) {
            nbh_id = parseInt(topNbhIn[0]['nbh_id'][i]);
        }
    }
    return nbh_id;
}

//function to  crime stats
function createCrimeTable(crimeData, nbhData, nbh_id) {

    j = 0;

    //d3.select("#demographic").text(tblElement)
    d3.select("#crimeStat").selectAll("table").remove();
    let table = d3.select("#crimeStat").append('table').attr('class', 'table table-striped')
    let header = table.append('thead')
    let headers = ['Murder', 'Rape', 'Robbery', 'Burglary', 'Larceny', 'MotorVehicle', 'Arson']
    headers.forEach(function (d) {
        let colHeader = header.append('th')
        colHeader.text(d)
        //'Agg.Assault', 
    })

    for (i = 0; i < crimeData['nbh_id'].length; i++) {
        if (nbh_id == parseInt(crimeData['nbh_id'][i])) {


            tblElement = "<table><tr>";
            tblElement = tblElement + "<th>Murder</th>" + "<th>Rape</th>" + "<th>Robbery</th>"
                + "<th>Burglary</th>" + "<th>Larceny</th>" + "<th>MotorVehicle</th>" + "<th>Arson</th>";
            tblElement = tblElement + "</tr></table>"
            //   + "<th>Agg.Assault</th>"

            var row = table.append('tr')
            let murder_row = row.append('td')
            let rape_row = row.append('td')
            let robb_row = row.append('td')
            //let assault_row = row.append('td')
            let burg_row = row.append('td')
            let larceny_row = row.append('td')
            let car_row = row.append('td')
            let arson_row = row.append('td')

            murder_row.text(addCommas(crimeData["crime_murder"][i]))
            rape_row.text(addCommas(crimeData["crime_rape"][i]))
            robb_row.text(addCommas(crimeData["crime_robbery"][i]))
            //assault_row.text(crimeData["crime_aggassault"][i])
            burg_row.text(addCommas(crimeData["crime_burglary"][i]))
            larceny_row.text(addCommas(crimeData["crime_larceny"][i]))
            car_row.text(addCommas(crimeData["crime_motorvehicle"][i]))
            arson_row.text(addCommas(crimeData["crime_arson"][i]))

        }
    }
}


// from html 
function changeNbh(nbh_name) {
    removeWalkScore();
    var nbh_index = getNbhIndex(nbh_name);
    buildGauge(overviewIn[0], nbh_index);
    createCensusPanel(censusCrimeIn[0], overviewIn[0], parseInt(overviewIn[0]['nbh_id'][nbh_index]))
    createCrimeTable(crimeStatsIn[0], overviewIn[0], parseInt(overviewIn[0]['nbh_id'][nbh_index]));
    buildBulletIncome(rentalIncomeIn[0], parseInt(overviewIn[0]['nbh_id'][nbh_index]))
    Update_statistics("0", overviewIn[0]['nbh_id'][nbh_index])
    ROIstat("0", overviewIn[0]['nbh_id'][nbh_index])
    BuildRental_incomeChart("0", overviewIn[0]['nbh_id'][nbh_index])
    rentalTypeChart("0", overviewIn[0]['nbh_id'][nbh_index])
    name = d3.select('#selCity option:checked').text();
    if (name != null) {
        name = (name.concat(", ")).concat(nbh_name)

    }
    else {
        name = nbh_name
    }
    console.log(name)
    d3.select("#heading").text(name)
}

// from html 
function changeCity(city_name) {
    removeWalkScore();
    var nbh_id = getCityNbh(city_name);
    var nbh_index = getNbhIndexId(nbh_id)
    var city_id = getCityId(city_name)
    buildGauge(overviewIn[0], nbh_index);
    createCensusPanel(censusCrimeIn[0], overviewIn[0], nbh_id)
    createCrimeTable(crimeStatsIn[0], overviewIn[0], nbh_id);
    buildBulletIncome(rentalIncomeIn[0], nbh_id)
    Update_statistics(city_id, "0")
    ROIstat(city_id, "0")
    rentalTypeChart(city_id, "0")
    BuildRental_incomeChart(city_id, "0")
    updateNeighborhoods(city_name)

    city_name = d3.select('#selCity option:checked').text();
    d3.select("#heading").text(city_name)

}

// clear walking score visualization
function removeWalkScore() {
    d3.select("walkscore").selectAll("div").remove();
}

function buildGauge(nbh_ovw, nbh_index) {
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
        font: { family: "Arial", size: 12, color: "#337AB7" }, width: 275, height: 100, margin: { t: 0, b: 0 }, plot_bgcolor: "azure",
        paper_bgcolor: "azure",
    };
    Plotly.newPlot('walkScore', data, layout);
}

//******************** */
// update the neighborhoods based on the selection
function updateNeighborhoods(cityName) {

    var neighborHoods = [];
    for (i = 0; i < citiesIn[0]['city'].length; i++) {
        if (cityName == citiesIn[0]['city'][i]) {
            neighborHoods.push(citiesIn[0]['nbh_name'][i])
        }
    }

    d3.select("#selNeighborhood").selectAll("option").remove()
    createDropList(neighborHoods, "selNeighborhood", "Select Neighborhood", 2);
}


//build bullet chart for rental income section
function buildBulletIncome(nbh_insights_data, nbh_index) {
    console.log("iam here")


    for (i = 0; i < nbh_insights_data['nbh_id'].length; i++) {
        if (nbh_index == parseInt(nbh_insights_data['nbh_id'][i])) {
            rental_income = nbh_insights_data["rental_income"][i]
            rental_income_change_pct = rental_income + ((rental_income * nbh_insights_data["rental_income_change_pct"][i]) / 100)
            console.log(nbh_insights_data["rental_income"][i]);
            console.log(nbh_insights_data["rental_income_change_pct"][i]);

        }
    }

    var data = [
        {
            type: "indicator",
            mode: "number+gauge+delta",
            gauge: { shape: "bullet", bar: { color: "darkblue" } },
            delta: { reference: rental_income_change_pct },
            value: rental_income,
            domain: { x: [0, 1], y: [0, 1] },
            title: {
                text: "Avg Monthly",
                font: { size: 12 }
            }
        }
    ];

    var layout = { width: 400, height: 75, margin: { l: 100, r: 10, b: 25, t: 5 } };
    Plotly.newPlot('income', data, layout);

}
function removeBulletIncome() {
    d3.select("income").selectAll("div").remove();
}
//******************* */

//******************* */