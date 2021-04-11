# DATA JOURNALISM AND D3
This project aims to provide data visualization by analyzing the current trends shaping people’s lives, as well as creating charts, graphs, and interactive elements to help readers understand findings.

The data set included for analysis is based on 2014 ACS 1-year estimates from the US Census Bureau. The current data set includes data on rates of income, obesity, poverty, etc. by state. MOE stands for “margin of error.”

- **Data Resource:** D3_data_journalism/assets/data/data.csv
- **Script File:** D3_data_journalism/assets/js/app.js
- **Landing page:** D3_data_journalism/index.html

## D3 Dabbler
It creates a scatter plot between two of the data variables such as Healthcare vs. Poverty or Smokers vs. Age.

A scatter plot is created using the D3 techniques that represents each state with circle elements. The code for this graphic is available in the app.js file. All data are pull from data.csv file by using d3.csv function.

It also includes state abbreviations in the circles.

Creates and situates axes and labels to the left and bottom of the chart.

## Interact graph

### More Data, More Dynamics

It includes more demographics and more risk factors. There are additional labels in scatter plot and allow click events so that your users can decide which data to display. It also animates the transitions for circles’ locations as well as the range of axes. This has been created for three risk factors for each axis.

### Incorporate d3-tip

While the ticks on the axes allow us to infer approximate values for each circle, it’s impossible to determine the true value without adding another layer of data. Enter tooltips: to reveal a specific element’s data when the user hovers their cursor over the element. It shows tooltips to circles and display each tooltip with the data that the user has selected.
