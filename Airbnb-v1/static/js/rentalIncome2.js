
function BuildRental_incomeChart(city_id, nbh_id){


    url = "/api/rental_size/";
    url = url.concat(city_id)
    url = url.concat("/")
    url = url.concat(nbh_id)
    console.log(url)

    var dataset = [
      ['札幌',703, 1902],
      ['清水',1473,3341],
      ['松本',863,1935],
      ['Ｃ大阪',1494,3008],
      ['京都',965,1743],
      ['岡山',568,1271],
      ['町田',189, 626],
      ['横浜ＦＣ',464, 1064],
      ['徳島',731, 1443],
      ['愛媛',306, 630],
      ['千葉',899, 2556],
      ['山口',231, 880],
      ['水戸',262, 589],
      ['山形',429, 1497],
      ['長崎',322, 749],
      ['熊本',315, 720],
      ['群馬',228, 522],
      ['東京Ｖ',436, 1391],
      ['讃岐',287, 613],
      ['岐阜',419,932],
      ['金沢',296,612],
      ['北九州',343,855]
    ];
  

    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = 400,
        height = 400;
  propertyArray =[]
           // Load data from rental size
    d3.json(url).then(function(data) {
    
    
      // Cast the hours value to a number for each piece of data
      data.forEach(function(d) {
       
        d.RentalSizeinfo.rental_income = +parseFloat(d.RentalSizeinfo.rental_income);
        d.RentalSizeinfo.median_occupancy = +parseFloat(d.RentalSizeinfo.median_occupancy) * 100;
        propertyArray.push(d.RentalSizeinfo.rental_income)
  
      });
  
      data.sort(function(a, b) {
        return d3.ascending(a.RentalSizeinfo.rental_income, b.RentalSizeinfo.rental_income)
      })
console.log(data)

var property = data.map(function(d){
  return d.RentalSizeinfo.bed_number 
})
var incomes = data.map(function(d){
  return d.RentalSizeinfo.rental_income 
})
     
var occupancy = data.map(function(d){
  return d.RentalSizeinfo.median_occupancy 
})
 
dataset = [property, incomes, occupancy]
console.log(dataset)
    var xScale = d3.scaleBand()
                  .rangeRound([0, width])
                  .padding(0.1)
                  .domain(dataset.map(function(d) {
                    return d[0];
                  }));
        yScale = d3.scaleLinear()
                  .rangeRound([height, 0])
                  .domain([0, d3.max(dataset, (function (d) {
                    return d[2];
                  }))]);
  
    var svg = d3.select("body").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom);
  
    var g = svg.append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // axis-x
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));
  
    // axis-y
    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yScale));
  
    var bar = g.selectAll("rect")
      .data(dataset)
      .enter().append("g");
  
    // bar chart
    bar.append("rect")
      .attr("x", function(d) { d=>d[0]; })
      .attr("y", function(d) { d=>d[1]; })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(d[2]); })
      .attr("class", function(d) {
        var s = "bar ";
        if (d[1] < 3000) {
          return s + "bar1";
        } else if (d[1] < 6000) {
          return s + "bar2";
        } else {
          return s + "bar3";
        }
      });
  
    // labels on the bar chart

  


    bar.append("text")
      .attr("dy", "1.3em")
      .attr("x", d => xBandScale(d[0]))
      .attr("y", d => yLinearScale(d[1]))
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "black")
      .text(function(d) {
        return d[1];
      });
  
    // line chart
    //var line = d3.line()
      //  .x(function(d, i) { return xScale(d[0]) + xScale.bandwidth() / 2; })
        //.y(function(d) { return yScale(d[1]); });
        //.curve(d3.curveLinear);
  
    bar.append("path")
      .attr("class", "line") // Assign a class for styling
      .attr("d", line(dataset)); // 11. Calls the line generator
  
    });
   
}

BuildRental_incomeChart("28719", "0")