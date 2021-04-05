// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


d3.csv("/D3_data_journalism/assets/data/data.csv").then(function(data)
{
    console.log(data);

    let poverty_list = data.map(data => data.poverty);

    console.log("Poverty List:",poverty_list);

    let healthcare_list = data.map(data => data.healthcare);

    console.log("Healthcare List:",healthcare_list);

    let state_list = data.map(data => data.abbr);

    console.log("State List:",state_list);

   // scale y to chart height
    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(healthcare_list)])
                    .range([chartHeight, 0]);

    // scale x to chart width
    var xScale = d3.scaleBand()
                    .domain(poverty_list)
                    .range([0, chartWidth])
                    .padding(0.05);

    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    // set x to the bottom of the chart
    chartGroup.append("g")
                .attr("transform", `translate(0, ${chartHeight})`)
                .call(xAxis);

    // set y to the y axis
    // This syntax allows us to call the axis function
    // and pass in the selector without breaking the chaining
    chartGroup.append("g")
                .call(yAxis);

}).catch(function(error) {
    console.log(error);
  });