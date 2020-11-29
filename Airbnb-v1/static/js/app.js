// YOUR CODE HERE!
console.log('This is the Airbnb-v1 plotly js file');

// Fetch the JSON data and call function init
d3.json("./samples.json").then(data => init(data));