url = "/api/statistics/28719/0"
d3.json(url).then(function(data) {

    // Grab values from the response json object to build the plots

    console.log(data[0])
   
    d3.select("#daily").text(data[0].statinfo.average_daily_price)
    d3.select("#nightly").text(data[0].statinfo.night_price)
    d3.select("#cleaning").text(data[0].statinfo.cleaning_fee)

    d3.select("#occupancy").text(data[0].statinfo.avg_occupancy)
    d3.select("#availablity").text(data[0].statinfo.airbnb_count)
    d3.select("#review").text(data[0].statinfo.review_count)

 

});