// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 660;
var svgHeight = 400;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 50
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


d3.csv("/assets/data/data.csv").then(function(data)
{
  // var chartGroup = svg.append("g")
  // .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
  
    console.log(data);

    let poverty_list = data.map(data => data.poverty);

    console.log("Poverty List:",poverty_list);

    let healthcare_list = data.map(data => data.healthcare);

    console.log("Healthcare List:",healthcare_list);

    let state_list = data.map(data => data.abbr);

    console.log("State List:",state_list);

    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });

     // scale x to chart width
     var xScale = d3.scaleLinear()
                    .domain([d3.min(data, d => d.poverty)*0.9, d3.max(data, d => d.poverty)*1.1])
                    .range([0, chartWidth]);
                    //.padding(0.05);

   // scale y to chart height
    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.healthcare)])
                    .range([chartHeight, 0]);

    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    // set x to the bottom of the chart
    chartGroup.append("g")
                .attr("transform", `translate(0, ${chartHeight})`)
                .call(xAxis);

    // set y to the y axis

    chartGroup.append("g")
                .call(yAxis);

    var cirlceGroup = chartGroup.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d.poverty))
                .attr("cy", d => yScale(d.healthcare))
                .attr("r","8")
                .attr("fill", "pink")
                .attr("text",d => d.id + ":" + d.abbr);

      chartGroup.selectAll("circle")
                .select("text")
                .data(data)
                .enter()
                .append("text")
                .attr("dx", d => xScale(d.poverty)-5)
                .attr("dy", d => yScale(d.healthcare)+3)
                .text(function(d){return d.abbr})
                .attr("font-size",8);

                // Create axes labels
    chartGroup.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - chartMargin.left - 5)
              .attr("x", 0 - (chartHeight / 2) - 40)
              .attr("dy", "1em")
              .attr("class", "axisText")
              .text("Lacks Healthcare (%)");

    chartGroup.append("text")
            .attr("transform", `translate(${(svgWidth / 2)-100}, ${chartHeight + chartMargin.top + 10})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");


            // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([5, -5])
    .html(function(d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  cirlceGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
})
// .catch(function(error) {
//     console.log(error);
//   });