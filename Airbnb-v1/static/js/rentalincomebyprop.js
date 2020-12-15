

// the function uses the canvas.js java script library for building the chart
function BuildRental_incomeChart(city_id, nbh_id){

    // build the url
    url = "/api/rental_type/";
    url = url.concat(city_id)
    url = url.concat("/")
    url = url.concat(nbh_id)
    console.log(url)

// Load data from rental size
d3.json(url).then(function(data) {

    dataPoints = []
    // Cast the rental_income value to a number for each piece of data
    data.forEach(function(d) {
        d.Rentalinfo.rental_income  = + d.Rentalinfo.rental_income 

        // build the datapoints to create the graph
        dict = {
            y : d.Rentalinfo.rental_income, label : d.Rentalinfo.property_type
        }
        dataPoints.push(dict)

    
    });
console.log(dataPoints)

// set the chart configuration
var chart = new CanvasJS.Chart("incomeChart", {
	animationEnabled: true,
    height:300,
    width :600,
	title:{
        text:"Rental income by Property",
        fontSize: 15
	},
	axisX:{
		interval: 1
	},
	axisY2:{
		interlacedColor: "rgba(1,77,101,.2)",
		gridColor: "rgba(1,77,101,.1)",
		title: "Rental Income"
	},
	data: [{
		type: "bar",
		name: "companies",
		axisYType: "secondary",
		color: "#014D65",
		dataPoints: dataPoints
	}]
});
chart.render()

});
   
}

// set the default to houston city
BuildRental_incomeChart("28719", "0")