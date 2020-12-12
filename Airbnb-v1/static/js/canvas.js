

    url = "/api/historical/New York";
    var parseDate = d3.timeParse("%Y-%m-%d");
    // Load data from rental size
    d3.json(url).then(function(data) {
    
    
        // Cast the hours value to a number for each piece of data
        data.forEach(function(d) {
         
          d.Historical.price = +parseFloat(d.Historical.price) * 12;
          d.Historical.date = +parseDate(d.Historical.date)
        
        });
    
    console.log(data)

    dataPoints = {x : new Date(d3.map(d=>d.Historical.date)), y : d3.map(d=>d.Historical.price)};
    console.log(dataPoints)
var chart = new CanvasJS.Chart("chartContainer", {
	title: {
		text: "Average Rental Income"
	},
	axisX: {
		valueFormatString: "MMM YYYY"
	},
	axisY2: {
		title: "Average Rental Income",
		prefix: "$",
		suffix: "K"
	},
	toolTip: {
		shared: true
	},
	legend: {
		cursor: "pointer",
		verticalAlign: "top",
		horizontalAlign: "center",
		dockInsidePlotArea: true,
		itemclick: toogleDataSeries
	},
	data: [{
		type:"line",
		axisYType: "secondary",
		name: "New York",
		showInLegend: true,
		markerSize: 0,
		yValueFormatString: "$#,###k",
		dataPoints: dataPoints	
		
    }]
});

chart.render();
});

function toogleDataSeries(e){
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	} else{
		e.dataSeries.visible = true;
	}
    chart.render();
}
