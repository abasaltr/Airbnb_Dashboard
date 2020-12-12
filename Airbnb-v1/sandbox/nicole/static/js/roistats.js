function ROIstat(city_id, nbh_id){

  url = "/api/statistics/"+city_id+"/"+nbh_id

  d3.json("url").then((data) => {
  console.log(((data[0].statinfo.rental_income * 12)/data[0].statinfo.median_price))
    var trace = [
        {
          type: "indicator",
          mode: "number+gauge+delta",
          value: (((data[0].statinfo.rental_income * 12)/data[0].statinfo.median_price)*100),
          domain: { x: [0, 1], y: [0, 1] },
          title: {
            text:
              "<b>Profit</b><br><span>",
            font: { size: 14 }
          },
          gauge: {
            shape: "bullet",
            axis: { range: [null, 10] },
            bgcolor: "white",
            steps: [{ range: [0, 2], color: "red" }, { range: [2, 4], color: "orange" }, { range: [4, 6], color: "yellow" }, { range: [6, 8], color: "limegreen" }, { range: [8, 10], color: "green" }],
            bar: { color: "black" }
          }
        }
      ];
      
      var layout = { width: 400, height: 230 };
      var config = { responsive: true };


      Plotly.newPlot('myDiv', trace, layout, config);
  });
}