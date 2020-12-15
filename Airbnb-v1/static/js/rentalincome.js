
/// This method retrieves the rental income information based on the rental type.
function BuildRentalVsOccupancyChartForRentalType(city_id, nbh_id){

    // the url pulls the rental_type based on the bed number 
    url = "/api/rental_type/";
    url = url.concat(city_id)
    url = url.concat("/")
    url = url.concat(nbh_id)
    //console.log(url)
  
    
    // Load data from rental size
    d3.json(url).then(function(data) {
    
    
      // Cast the rental_income, nights_booked and median_occupancy value to a number for each piece of data
      data.forEach(function(d) {
       
        d.Rentalinfo.rental_income = +parseFloat(d.Rentalinfo.rental_income);
        d.Rentalinfo.nights_booked = + (parseFloat(d.Rentalinfo.nights_booked)) ; 
        //d.RentalSizeinfo.count = +parseFloat(d.RentalSizeinfo.count) ; 
  
      });

    data =  data.sort(function(a, b) {
      return d3.ascending(a.Rentalinfo.rental_income, b.Rentalinfo.rental_income)
    })

var property = data.map(function(d){
  return d.Rentalinfo.property_type 
})
var incomes = data.map(function(d){
  return d.Rentalinfo.rental_income 
})
     
var occupancy = data.map(function(d){
  return d.Rentalinfo.nights_booked 
})

      
     /*  var trace1 = {
        x: property,
        y: incomes,

        type:'bar',
        xaxis:'x',
        yaxis:'y',
      
        name: 'Average Incomes'
      };
      
      var trace2 = {
        x: property,
        y: occupancy,      
        xaxis:'x',
        //yaxis:'y2',
        name: 'Median Occupancy',
        type: 'scatter'
      };
      
      var data = [trace1, trace2];
      
      var layout = {
        title: 'Rental Income vs Occupancy',
        yaxis: {title: 'Avg Rental Income'
      },
         
        yaxis2: {
          title: 'Median Occupancy',
          titlefont: {color: 'rgb(148, 103, 189)'},
          tickfont: {color: 'rgb(148, 103, 189)'},
          range :[0, 365],  // days of the year
          overlaying: 'y',
          side: 'right'
        }
      };
      
     
      var config = { responsive: true };
      var layout = { autosize: false, width: 600, height: 400,  margin: { l: 60,  r: 10, b: 25,  t: 25 } };
      Plotly.newPlot('map', data, layout, config);
     */

      var trace1 = {
        x:property,
        y: incomes,
        name: 'Avg Rental Income',
        type: 'bar'
      };
      
      var trace2 = {
        x: property,
        y: occupancy,
        name: 'Avg Occupancy',
        yaxis: 'y2',
        type: 'scatter'
      };
      
      
      
      var data = [trace1, trace2];
      
      var layout = {
        title: 'Rental Income vs Occupancy - Rental Type',
        width: 800,
        height: 400,
        
        yaxis: {
          title: 'Average Rental Income',
          titlefont: {color: '#1f77b4'},
          tickfont: {color: '#1f77b4'}
        },
        yaxis2: {
          title: 'Median Occupancy',
          titlefont: {color: '#d62728'},
          tickfont: {color: '#d62728'},
          anchor: 'x',
          overlaying: 'y',
          side: 'right'
        },
        margin: { l: 70,  r: 70, b: 100,  t: 50 } 
      };
      
      Plotly.newPlot('map', data, layout);

       
    }).catch(function(error) {
      console.log(error);
    });
    
    
        
    }
    // call the function with houstonid
    BuildRentalVsOccupancyChartForRentalType("28719", "0")