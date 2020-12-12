function rentalTypeChart(city_id, nbh_id){
  url = "/api/rental_type/"+city_id+"/"+nbh_id

  d3.json(url).then((incomingData) => {

    rental_type = []
    night_price = []
    cleaning_fee = []
    nights_booked = []
  
    for (i = 0; i < incomingData.length; i++){
        rental_type.push(incomingData[i].Rentalinfo.property_type)
        night_price.push(incomingData[i].Rentalinfo.night_price)
        cleaning_fee.push(incomingData[i].Rentalinfo.cleaning_fee)
        nights_booked.push(incomingData[i].Rentalinfo.nights_booked)
      }
  
    var trace1 = {
      x: rental_type,
      y: night_price,
      name: "Avg Nightly Price",
      type: "bar"
    };
  
    var trace2 = {
      x: rental_type,
      y: cleaning_fee,
      name: "Avg Cleaning Fee",
      type: "bar"
    };

    var trace3 = {
      x: rental_type,
      y: nights_booked,
      name: "Avg Nights Booked",
      type: "bar"
    };
  
    var data = [trace1, trace2, trace3];
  
    var layout = {
      title: "Average Rental Details Per Rental Type",
      xaxis: { title: "Rental Type"},
      yaxis: { title: "Avgerage"}
    };
  
    Plotly.newPlot("Type", data, layout);
  });
}
rentalTypeChart(25281,0)