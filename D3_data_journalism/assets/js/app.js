// @TODO: YOUR CODE HERE!


d3.csv("/D3_data_journalism/assets/data/data.csv").then(function(data)
{
    console.log(data);

    let poverty_list = data.map(data => data.poverty);

    console.log("Poverty List:",poverty_list);

    let healthcare_list = data.map(data => data.healthcare);

    console.log("Healthcare List:",healthcare_list);

    let state_list = data.map(data => data.abbr);

    console.log("State List:",state_list);
}).catch(function(error) {
    console.log(error);
  });