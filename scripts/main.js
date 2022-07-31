
/**
 * Helper Functions
 */
const groupBy = (arr, criteria) => {
    const newObj = arr.reduce(function (acc, currentValue) {
        if (!acc[currentValue[criteria]]) {
            acc[currentValue[criteria]] = [];
        }
        acc[currentValue[criteria]].push(currentValue);
        return acc;
    }, {});
    return newObj;
}

const getCOData = (pollutionData) => {
    return {
        "Date": d3.timeParse("%Y-%m-%d")(pollutionData["Date"]),
        "Year": pollutionData["Year"],
        "Month": pollutionData["Month"],
        "Day": pollutionData["Day"],
        "Address": pollutionData["Address"],
        "State": pollutionData["State"],
        "County": pollutionData["County"],
        "City": pollutionData["City"],
        "Mean": parseFloat(pollutionData["CO Mean"], 10),
        "CO 1st Max Value": pollutionData["CO 1st Max Value"],
        "CO 1st Max Hour": pollutionData["CO 1st Max Hour"],
        "CO AQI": pollutionData["CO AQI"],
       
    };
}

const getO3Data = (pollutionData) => {
    return {
        "Date": d3.timeParse("%Y-%m-%d")(pollutionData["Date"]),
        "Year": pollutionData["Year"],
        "Month": pollutionData["Month"],
        "Day": pollutionData["Day"],
        "Address": pollutionData["Address"],
        "State": pollutionData["State"],
        "County": pollutionData["County"],
        "City": pollutionData["City"],
        "Mean": parseFloat(pollutionData["O3 Mean"], 10),
        "O3 1st Max Value": pollutionData["O3 1st Max Value"],
        "O3 1st Max Hour": pollutionData["O3 1st Max Hour"],
        "O3 AQI": pollutionData["O3 AQI"]
    };
}

const getNO2Data = (pollutionData) => {
    return {
        "Date": d3.timeParse("%Y-%m-%d")(pollutionData["Date"]),
        "Year": pollutionData["Year"],
        "Month": pollutionData["Month"],
        "Day": pollutionData["Day"],
        "Address": pollutionData["Address"],
        "State": pollutionData["State"],
        "County": pollutionData["County"],
        "City": pollutionData["City"],
        "Mean": parseFloat(pollutionData["NO2 Mean"], 10),
        "NO2 1st Max Value": pollutionData["NO2 1st Max Value"],
        "NO2 1st Max Hour": pollutionData["NO2 1st Max Hour"],
        "NO2 AQI":pollutionData["NO2 AQI"]
    };
}

const getSO2Data = (pollutionData) => {
    return {
        "Date": d3.timeParse("%Y-%m-%d")(pollutionData["Date"]),
        "Year": pollutionData["Year"],
        "Month": pollutionData["Month"],
        "Day": pollutionData["Day"],
        "Address": pollutionData["Address"],
        "State": pollutionData["State"],
        "County": pollutionData["County"],
        "City": pollutionData["City"],
        "Mean": parseFloat(pollutionData["SO2 Mean"], 10),
        "SO2 1st Max Value": pollutionData["SO2 1st Max Value"],
        "SO2 1st Max Hour": pollutionData["SO2 1st Max Hour"],
        "SO2 AQI": pollutionData["SO2 AQI"],
    };
}

const groupByPollutant = (arr) => {
    let newObj = {
        "Carbon Monoxide" : [],
        "Nitrogen Dioxide": [],
        "Ground-Level Ozone": [],
        "Sulfur Dioxide": []
    };
    arr.forEach((pollutionData) => {
        newObj["Carbon Monoxide"].push(getCOData(pollutionData));
        newObj["Ground-Level Ozone"].push(getO3Data(pollutionData));
        newObj["Nitrogen Dioxide"].push(getNO2Data(pollutionData));
        newObj["Sulfur Dioxide"].push(getSO2Data(pollutionData));

    });

    return newObj;
}

function addStateAndCountyButton(states, counties) {
    // add the options to the button
    d3.select("#selectStateButton")
    .selectAll('myOptions')
        .data(states)
    .enter()
        .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button
    .attr("id", "stateOption");

    d3.select('#selectStateButton').on("change", function() {
        let stateValue = getSelectedStateValue(); 
        if (stateValue !== 'SelectState') {
            addCountyButton(counties[stateValue]);
        }
    });
}

function addPollutantButton(pollutant) {
    // add the options to the button
    d3.select("#selectPollutantButton")
    .selectAll('myOptions')
        .data(pollutant)
    .enter()
        .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button
    .attr("id", "pollutantOption");
}

function addCountyButton(county) {
    console.log(county);
    d3.selectAll("#countyOption")
        .remove();
    // add the options to the button
    d3.select("#selectCountyButton")
    .selectAll('myOptions')
        .data(county)
    .enter()
        .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button
    .attr("id", "countyOption");
}

function getSelectedStateValue(){
    return d3.select('#selectStateButton').property("value");
}

function getSelectedPollutantValue(){
    return d3.select('#selectPollutantButton').property("value");
}

function getSelectedCountyValue() {
    return d3.select('#selectCountyButton').property("value");
}

function updateChart(selectedData) {
    console.log(selectedData);

    // set the dimensions and margins of the graph
    let margin = {top: 30, right: 60, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select("#canvas")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    let x = d3.scaleTime()
      .domain(d3.extent(selectedData, function(d) { return d.Date; }))
      .range([ 0, width ]);
    xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    let y = d3.scaleLinear()
      .domain([d3.min(selectedData, function(d) { return d.Mean; }), 
        d3.max(selectedData, function(d) { return d.Mean; })])
      .range([ height, 0 ]);
    yAxis = svg.append("g")
      .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChartContent)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    var line = svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Add the line
    line.append("path")
      .datum(selectedData)
      .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.Date) })
        .y(function(d) { return y(d.Mean) })
        )

    // Add the brushing
    line
      .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChartContent() {

      // What are the selected boundaries?
      extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
      }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and line position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      line
          .select('.line')
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.Date) })
            .y(function(d) { return y(d.Mean) })
          )
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick",function(){
      x.domain(d3.extent(selectedData, function(d) { return d.Date; }))
      xAxis.transition().call(d3.axisBottom(x))
      line
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function(d) { return x(d.Date) })
          .y(function(d) { return y(d.Mean) })
      )
    });

}

function triggerSubmitButton(selectedStateValue, selectedCountyValue ,selectPollutantValue, pollutionData) {
    d3.select("svg")
        .remove();
    updateChart(pollutionData[selectPollutantValue][selectedStateValue][selectedCountyValue]);
}

/**
 * Init function
 */
function init() {
    d3.csv("data/pollution_2000_2021.csv")
    .then(pollutionData => {
        console.log(pollutionData);
        return pollutionData;
    })
    .then(pollutionData => {
        // Group By Pollutants.
        let groupByPollutantData = groupByPollutant(pollutionData);
        const pollutants = Object.keys(groupByPollutantData).sort();

        // Group By State Data from the groupedByPollutants
        let states;
        let counties = {};
        pollutants.forEach(pollutant => {
            let updatedGroupByStateData = groupBy(groupByPollutantData[pollutant], 'State');
            states = Object.keys(updatedGroupByStateData).sort();
            states.forEach(state => {
                let updatedGroupByCountyData = groupBy(updatedGroupByStateData[state], 'County');
                counties[state] = Object.keys(updatedGroupByCountyData).sort();
                updatedGroupByStateData[state] = updatedGroupByCountyData;
            })
            groupByPollutantData[pollutant] = updatedGroupByStateData;

        });
        
        // Log the Cleaned Data.
        console.log(groupByPollutantData);

        addStateAndCountyButton(states, counties);
        addPollutantButton(pollutants);
        
        d3.select('#SubmitButton').on("click", function() {
            let stateValue = getSelectedStateValue(); 
            let pollutantValue = getSelectedPollutantValue();
            let countyValue = getSelectedCountyValue();
            if ((stateValue !== 'SelectState') && (countyValue !== 'SelectCounty') && (pollutantValue !== 'SelectPollutant')) {
                triggerSubmitButton(stateValue, countyValue, pollutantValue, groupByPollutantData);
            } else {
                console.log("Not all fields are selected.")
            }
        });

    });
}



