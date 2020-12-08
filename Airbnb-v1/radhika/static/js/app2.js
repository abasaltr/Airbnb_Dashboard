



//..", "data", "census-csv", "merged_crime_census.csv
var csvData
d3.csv("../data/census-csv/merged_crime_census.csv").then(function (demodata) {
    //d3.json("../data/mash-api/120320/airbnb-listings-120320j.json").then((rentinfo) => {
    console.log(demodata);
    csvData = demodata;


    var tbody = document.getElementById('demoid');
    demodata.forEach(function (row) {
        // Add a row to HTML
        var rowElem = document.createElement('tr');
        tbody.appendChild(rowElem);

        addCell(rowElem, row.TotalPop);
        //add data for each column

        // addCell(rowElem.row.roi);
        // addCell(rowElem.row.xxx);
    });
})

function addCell(rowElem, cellData) {
    var cellElem = document.createElement('td');
    cellElem.textContent = cellData;
    rowElem.appendChild(cellElem);
}

function refreshSearch() {
    var countySelector = document.getElementById('selCity');
    var county = countySelector.value;
    var filteredRows = csvData.filter(row => row.County === county);

    var tbody = document.getElementById('demoid');
    tbody.textContent = '';

    filteredRows.forEach(function (row) {
        // Add a row to HTML
        var rowElem = document.createElement('tr');
        tbody.appendChild(rowElem);

        addCell(rowElem, row.TotalPop);
        // addCell(rowElem.row.roi);
        // addCell(rowElem.row.xxx);
    });

}

