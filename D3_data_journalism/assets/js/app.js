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
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.9, d3.max(data, d => d[chosenXAxis]) * 1.1 ])
    .range([0, svgWidth]);

  return xLinearScale;

}

// function used for updating x-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales

  console.log(d3.map(data, d => d[chosenYAxis]));
  console.log("max",d3.max(data, d => d[chosenYAxis]));
  var yLinearScale = d3.scaleLinear()
                    //.domain([0, d3.max(data, d => d[chosenYAxis])])
                    .domain([0,40])
                    .range([chartHeight, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) 
{
  var bAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bAxis);

  return xAxis;
}

// function used for updating xAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) 
{
  var bYxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(bYxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, attrValue) {

  circlesGroup.transition()
    .duration(1000)
    .attr(attrValue, d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderCircleText(circleTextGroup, newXScale, chosenXAxis, attrValue) {

  circleTextGroup.transition()
                .duration(1000)
                .attr(attrValue, d => newXScale(d[chosenXAxis]));

  return circleTextGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;
  var ylabel;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty";
  }
  else if(chosenXAxis === "age"){
    xlabel = "Age";
  }
  else {
    xlabel = "Income";
  }

  if (chosenYAxis === "obese") {
    ylabel = "Obese";
  }
  else if(chosenYAxis === "healthcare"){
    ylabel = "Healthcare";
  }
  else {
    ylabel = "Smokes";
  }
  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([-5, -5])
  .html(function(d) {
    return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}%<br>${ylabel}: ${d[chosenYAxis]}%`);
  });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function(data) {
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
  
    console.log(d3.max(data.map(data => data.smokes)));

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
    //  var xScale = d3.scaleLinear()
    //                 .domain([d3.min(data, d => d.poverty)*0.9, d3.max(data, d => d.poverty)*1.1])
    //                 .range([0, chartWidth]);
    //                 //.padding(0.05);

    var xLinearScale = xScale(data, chosenXAxis);

   // scale y to chart height
   var yLinearScale = yScale(data, chosenYAxis);

    // var yScale = d3.scaleLinear()
    //                 .domain([0, d3.max(data, d => d.healthcare)])
    //                 .range([chartHeight, 0]);

    // create axes
    var leftAxis = d3.axisLeft(yLinearScale);
    var bottomAxis = d3.axisBottom(xLinearScale);

    // set x to the bottom of the chart
    var xAxis = chartGroup.append("g")
                .classed("x-axis", true)
                .attr("transform", `translate(0, ${chartHeight})`)
                .call(bottomAxis);

    // set y to the y axis

    var yAxis = chartGroup.append("g")
                .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => xLinearScale(d[chosenXAxis]))
                .attr("cy", d => yLinearScale(d[chosenYAxis]))
                .attr("r","8")
                .attr("fill", "pink")
                .text(function(d){return d.abbr})
                .attr("text",function(d){return d.abbr});
                

    var circleTextGroup = chartGroup.selectAll("circle")
                .select("text")
                .data(data)
                .enter()
                .append("text")
                .attr("dx", d => xLinearScale(d[chosenXAxis])-5)
                .attr("dy", d => yLinearScale(d[chosenYAxis])+3)
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

  xlabelsGroup.append("text")
              .attr("x", 0)
              .attr("y", 20)
              .attr("value", "poverty") // value to grab for event listener
              .classed("inactive", true)
              .text("In Poverty (%)");

xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("active", true)
            .text("Age (Median)");

xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("active", true)
            .text("Household Income (Median)");


    // Create group for 3 y-axis labels
    var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `rotate(-90) translate(${0 - (chartHeight / 2) }, ${ 0 - chartMargin.left - 5})`);

    ylabelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 20)
                .attr("value", "obesity") // value to grab for event listener
                .classed("active", true)
                .text("Obese (%)");

    ylabelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 40)
                .attr("value", "smokes") // value to grab for event listener
                .classed("active", true)
                .text("Smokes (%)");

    ylabelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 60)
                .attr("value", "healthcare") // value to grab for event listener
                .classed("inactive", true)
                .text("Lacks Healthcare (%)");

    // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  //var circleTextGroup  = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");

      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(chosenXAxis);

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition 
        bottomAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, "cx");

        circleTextGroup = renderCircleText(circleTextGroup, xLinearScale, chosenXAxis, "dx");
        //console.log(circleTextGroup);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        //circleTextGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        
        // changes classes to disable selected axis and enable others
        xlabelsGroup.selectAll("text").attr("class","active");
        d3.select(this).attr("class", "inactive")
      }
    });

     // y axis labels event listener
  ylabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");

    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      console.log(chosenYAxis);

      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = yScale(data, chosenYAxis);

      // updates x axis with transition 
      leftAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis, "cy");

      circleTextGroup = renderCircleText(circleTextGroup, yLinearScale, chosenYAxis, "dy");
      //console.log(circleTextGroup);
      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
      //circleTextGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
      
      // changes classes to disable selected axis and enable others
      ylabelsGroup.selectAll("text").attr("class","active");
      d3.select(this).attr("class", "inactive")
    }
  });
})
// .catch(function(error) {
//     console.log(error);
//   });