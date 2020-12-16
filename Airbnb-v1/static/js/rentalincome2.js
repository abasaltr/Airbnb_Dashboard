// build rental_income chart with d3

// the chart is built based on the reference :- https://bl.ocks.org/htakeuchi/a60c0ecb55713c06c054c26c6dbed57a

// This method retrieves the rental income information based on the rental size.
// The rental size is determined as number of beds offered by the guests.
function BuildRentalIncomeVsOccupancyChartForRentalSize(city_id, nbh_id){

  // build the url
  url = "/api/rental_size/";
  url = url.concat(city_id).concat("/").concat(nbh_id)
 
  // set the margin
  var margin = {top: 20, right: 60, bottom: 60, left: 60},
  width = 600, 
  height = 400;

  d3.select("#rentaloccupancy").selectAll("svg").remove();

  // set the svg in the div tag
  var svg = d3.select("#rentaloccupancy").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

  var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Load data from rental size
    d3.json(url).then(function(dataset) {
    
      // build the dataset
    //dataset = [];
      // Cast the values to a number for each piece of data
      dataset.forEach(function(d) {
       
        d.RentalSizeinfo.rental_income = +parseFloat(d.RentalSizeinfo.rental_income);
        d.RentalSizeinfo.median_occupancy = +parseFloat(d.RentalSizeinfo.median_occupancy);
        //dataset.push([d.RentalSizeinfo.bed_number, d.RentalSizeinfo.median_occupancy, d.RentalSizeinfo.rental_income])
  
      });
 
    

    // set the xscale as xScaleBand
    var xScale = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .domain(dataset.map(function(d) {
      return d.RentalSizeinfo.bed_number;
    }));


    // set the yScale as linear
    var yScale = d3.scaleLinear()
    .rangeRound([height, 0])
    .domain([0, d3.max(dataset, (function (d) {
      return d.RentalSizeinfo.rental_income;
    }))]);

    // set the ySale2 as linear
    var yLinearScale2 = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(dataset, (function (d) {
      return d.RentalSizeinfo.median_occupancy;
    }))]);
        
                 
      // axis-x
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

  // axis-y
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(yScale));
  
  // set y linear scale2
  g.append("g")
    // Define the color of the axis text
    .classed("blue", true)
    .attr("transform", `translate(${width}, 0)`)
    .call(d3.axisRight(yLinearScale2));


    var bar = g.selectAll("rect")
      .data(dataset)
      .enter().append("g");

    // bar chart
    bar.append("rect")
      .attr("x", function(d) { return xScale(d.RentalSizeinfo.bed_number); })
      .attr("y", function(d) { return yScale(d.RentalSizeinfo.rental_income); })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(d.RentalSizeinfo.rental_income); })
      .attr("class", function(d) {
        var s = "bar ";
        if (d.RentalSizeinfo.median_occupancy < 500) {
          return s + "bar1";
        } else if (dRentalSizeinfo.median_occupancy < 1000) {
          return s + "bar2";
        } else {
          return s + "bar3";
        }
      });


     // labels on the bar chart
    bar.append("text")
      .attr("dy", "1.3em")
      .attr("x", function(d) { return xScale(d.RentalSizeinfo.bed_number) + xScale.bandwidth() / 2; })
      .attr("y", function(d) { return yScale(d.RentalSizeinfo.rental_income); })
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "black")
      .text(function(d) {
        return addCommas(d.RentalSizeinfo.rental_income);
      });

   

   
    // build the line chart
    var line = d3.line()
        .x(function(d, i) { return xScale(d.RentalSizeinfo.bed_number) })
        .y(function(d) { return yLinearScale2(d.RentalSizeinfo.median_occupancy); });
    
    // set the path for the line
    bar.append("path")
      .attr("class", "line") // Assign a class for styling
      .attr("d", line(dataset)); // 11. Calls the line generator

  var circleGroup =  bar.append("circle") // Uses the enter().append() method
                    .attr("class", "dot") // Assign a class for styling
                    .attr("cx", function(d, i) { return xScale(d.RentalSizeinfo.bed_number) })
                    .attr("cy", function(d) { return yLinearScale2(d.RentalSizeinfo.median_occupancy); })
                    .attr("r", 5);
                
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`Rental Size: ${d.RentalSizeinfo.bed_number}<br>Occupancy: ${d.RentalSizeinfo.median_occupancy}%`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    circleGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circleGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

 
    // set the xlabel
    g.append("text")
    .attr("transform", `translate(${width / 2- 20} , ${height + margin.top + 10})`)
      .classed("bed-text text", true)
      .text("Avg bed count");

      // set the yLabel
      g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2 + 40))
      .attr("dy", "1em")
      .classed("income-text", true)
      .text("Avg Rental Income");
    
      
      
      // set the yLabel second axis
      g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", width)
      .attr("x", 0 - (height / 2 + 40))
      .attr("dy", "1em")
      .classed("occu-text", true)
      .text("Avg Occupancy");

      //set the Title
      g.append("text")
      .attr("transform", `translate(${0 + margin.left , 0+ margin.top})`)
      .attr("dy", "1em")
      .classed("title-text", true)
      .text("Rental Income Vs Avg Occupancy Rate - Rental Size");  
    
      console.log("compl");

      });
   
}

// call the BuildRentalIncomeVsOccupancyChart with houstonid
BuildRentalIncomeVsOccupancyChartForRentalSize("28719", "0")