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
    .text(function (d) { return d; })
    .attr("value", function (d) { return d; })
    .attr("id", "stateOption");

    d3.select('#selectStateButton').on("change", function() {
        let stateValue = getSelectedStateValue(); 
        if (stateValue !== 'SelectState') {
            addCountyButton(counties[stateValue]);
        }
    });
}

function addPollutantButton(pollutant) {
    d3.select("#selectPollutantButton")
    .selectAll('myOptions')
        .data(pollutant)
    .enter()
        .append('option')
    .text(function (d) { return d; })
    .attr("value", function (d) { return d; })
    .attr("id", "pollutantOption");
}

function addCountyButton(county) {
    console.log(county);
    d3.selectAll("#countyOption")
        .remove();

    d3.select("#selectCountyButton")
    .selectAll('myOptions')
        .data(county)
    .enter()
        .append('option')
    .text(function (d) { return d; })
    .attr("value", function (d) { return d; })
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

function triggerSubmitButton(selectedStateValue, selectedCountyValue ,selectPollutantValue, pollutionData) {
    d3.select("svg").remove();
    
    const selectedData = pollutionData[selectPollutantValue][selectedStateValue][selectedCountyValue];
    console.log(selectedData);

    let margin = {top: 30, right: 60, bottom: 50, left: 60};
    let width = 1000 - margin.left - margin.right;
    let height = 450 - margin.top - margin.bottom;

    let svg = d3.select("#canvas")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    
    let y = d3.scaleLinear()
        .domain([d3.min(selectedData, function(d) { return d.Mean; }), 
            d3.max(selectedData, function(d) { return d.Mean; })])
        .range([ height, 0 ]);
    let yAxis = svg.append("g")
        .call(d3.axisLeft(y));

    let pollutantUnits = '(in Parts-per Million)';
    if (selectPollutantValue === 'Sulfur Dioxide') {
        pollutantUnits = '(in Parts-per Billion)';
    }
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(selectPollutantValue + " Mean Value " + pollutantUnits);

    let x = d3.scaleTime()
        .domain(d3.extent(selectedData, function(d) { return d.Date; }))
        .range([ 0, width ]);
    let xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + 35)+ ")")
        .style("text-anchor", "middle")
        .text("Date");


    svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    
    let linePath = svg.append('g').attr("clip-path", "url(#clip)");

    linePath.append("path")
        .datum(selectedData)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.Date) })
            .y(function(d) { return y(d.Mean) })
        )

    let brush = d3.brushX()
        .extent( [ [0,0], [width,height] ] )
        .on("end", updateChartContent);

    linePath.append("g")
        .attr("class", "brush")
        .call(brush);

    let idleTimeout
    function idled() { 
        idleTimeout = null; 
    }

    function updateChartContent() {
        extent = d3.event.selection

        if(!(d3.event.selection)){
            if (!idleTimeout) {
                return idleTimeout = setTimeout(idled, 350);
            }
            x.domain([4,8]);
        }else{
            x.domain([
                x.invert(d3.event.selection[0]),
                x.invert(d3.event.selection[1])
            ])
            linePath.select(".brush").call(brush.move, null)
        }

        xAxis.transition().duration(1000).call(d3.axisBottom(x))
        linePath.select('.line')
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function(d) { return x(d.Date) })
                .y(function(d) { return y(d.Mean) })
            )
    }

    svg.on("dblclick", function(){
        x.domain(d3.extent(selectedData, function(d) { return d.Date; }))
        xAxis.transition().duration(1000).call(d3.axisBottom(x))
        linePath.select('.line')
            .transition()
            .attr("d", d3.line()
                .x(function(d) { return x(d.Date) })
                .y(function(d) { return y(d.Mean) })
            )
    });
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



