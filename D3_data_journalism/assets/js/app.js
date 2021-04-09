// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

var chartMargin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
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

// Initial Params
var chosenXAxis = "poverty";

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "Poverty") {
    label = "Poverty";
  }
  else if(chosenXAxis === "age"){
    label = "age";
  }
  else {
    label = "income";
  }

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

  return circlesGroup;
}


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

            // Step 6: Initialize tool tip
    // ==============================
  //   var toolTip = d3.tip()
  //   .attr("class", "tooltip")
  //   .offset([5, -5])
  //   .html(function(d) {
  //     return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
  //   });

  // // Step 7: Create tooltip in the chart
  // // ==============================
  // chartGroup.call(toolTip);

  // // Step 8: Create event listeners to display and hide the tooltip
  // // ==============================
  // cirlceGroup.on("mouseover", function(data) {
  //   toolTip.show(data, this);
  // })
  //   // onmouseout event
  //   .on("mouseout", function(data, index) {
  //     toolTip.hide(data);
  //   });

      // // Create axes labels
      // chartGroup.append("text")
      // .attr("transform", "rotate(-90)")
      // .attr("y", 0 - chartMargin.left - 5)
      // .attr("x", 0 - (chartHeight / 2) - 40)
      // .attr("dy", "1em")
      // .attr("class", "axisText")
      // .text("Lacks Healthcare (%)");

  // chartGroup.append("text")
  //   .attr("transform", `translate(${(svgWidth / 2)-100}, ${chartHeight + chartMargin.top + 10})`)
  //   .attr("class", "axisText")
  //   .text("In Poverty (%)");
    

  // Create group for two x-axis labels
    var xlabelsGroup = chartGroup.append("g")
                                  .attr("transform", `translate(${svgWidth / 2 - 40}, ${svgHeight - 80})`);

  var lblPoverty = xlabelsGroup.append("text")
                                    .attr("x", 0)
                                    .attr("y", 20)
                                    .attr("value", "poverty") // value to grab for event listener
                                    .classed("active", true)
                                    .text("In Poverty (%)");

  var lblAge = xlabelsGroup.append("text")
                                .attr("x", 0)
                                .attr("y", 40)
                                .attr("value", "age") // value to grab for event listener
                                .classed("inactive", true)
                                .text("Age (Median)");

  var lblIncome = xlabelsGroup.append("text")
                          .attr("x", 0)
                          .attr("y", 60)
                          .attr("value", "income") // value to grab for event listener
                          .classed("inactive", true)
                          .text("Household Income (Median)");


    // Create group for two x-axis labels
    var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `rotate(-90) translate(${0 - (chartHeight / 2) }, ${ 0 - chartMargin.left - 5})`);

    var lblObese = ylabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "obesity") // value to grab for event listener
      .classed("active", true)
      .text("Obese (%)");

    var lblAge = ylabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

    var lblIncome = ylabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
})
// .catch(function(error) {
//     console.log(error);
//   });