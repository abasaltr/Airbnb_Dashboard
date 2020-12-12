
function Update_statistics(city_id, nbh_id)
{
 
url = "/api/statistics/";
url = url.concat(city_id)
url = url.concat("/")
url = url.concat(nbh_id)

d3.json(url).then(function(data) {

    // Grab values from the response json object to build the plots

   
    d3.select("#daily").text("$" + data[0].statinfo.average_daily_price)
    d3.select("#nightly").text("$" + data[0].statinfo.night_price)
    d3.select("#cleaning").text("$" + data[0].statinfo.cleaning_fee)

    d3.select("#occupancy").text(data[0].statinfo.avg_occupancy + "%")
    d3.select("#availablity").text(addCommas(data[0].statinfo.airbnb_count))
    d3.select("#review").text(Math.ceil(parseInt((data[0].statinfo.review_count))))

 

});


}

Update_statistics(28719,0)