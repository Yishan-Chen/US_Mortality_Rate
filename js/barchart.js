function barChart(year, flag, stateName){
  var margin = {top: 20, right: 20, bottom: 20, left: 120};

  var width = 800 - margin.left - margin.right,
      height = 1100 - margin.top - margin.bottom;

  var barchartsvg = d3.select("#barchart").append("svg")
  .attr("id", "barChart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var csvFile = "data/NCHS_-_Leading_Causes_of_Death__United_States.csv";
  d3.csv(csvFile, function (error, csv) {
    if(error){
      throw error;
    } else {
      var data = csv.filter(csv => csv.Year === year && csv.State !== "United States" && csv.CauseName === "All causes");
      data.forEach(function(d){
        d.State = d.State;
        d.Deaths = parseFloat(d.Deaths);
      });
    }

    if(flag){
      var maxValue = parseFloat(document.getElementById("inputBoxMax").value);
      var minValue = parseFloat(document.getElementById("inputBoxMin").value);
      var data = data.filter(data => data.Deaths > minValue && data.Deaths < maxValue);
    }
    var selectedState = document.getElementById("inputBoxState").value;

    data.sort(function(a, b) { return b.Deaths - a.Deaths; });
    var bar_height = 18;
    var gap = 3;
    var states = [];

    maxDeath = d3.max(data, d => d.Deaths)

    var x = d3.scaleLinear()
    .domain([0, maxDeath])
    .range([0, 600])

    var xAxis = d3.axisTop(x)
    var xAxisGroup = barchartsvg.append("g")
    .transition()
    .call(xAxis);

    data.forEach(function(d){
      states.push(d.State);
    })

    var range = ["#ffd8d8", "#910000"];
    var domain = d3.extent(data, function(d){
      return d.Deaths;
    });
    var colorScale = d3.scaleLinear()
    .domain(domain)
    .range(range);

    var y = d3.scaleBand()
    .domain(states)
    .rangeRound([0, (bar_height + gap) * data.length]);

    var line = barchartsvg.append("line")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", (bar_height + gap * 2) * data.length)
    .attr("stroke-width", 1)
    .attr("stroke", "white");

    d3.selectAll("rect").remove();

    var rects = barchartsvg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", function(d){ return y(d.State) + gap; })
    .attr("name", function(d, i){ return d.State; })
    .attr("width", 0)
    .attr("height", bar_height)
    .attr("fill", function(d){
      if(d.State === selectedState) {
        return "#FFFAFA";
      } else if (d.State === stateName) {
        return "#FFFAFA";
      } else {
        return colorScale(d.Deaths);
      }
    });

    barchartsvg.selectAll("rect")
    .transition()
    .delay(function (d) {return Math.random()*1000;})
    .duration(1000)
    .attr("width", function(d, i){ return x(d.Deaths); });

    var text_name = barchartsvg.selectAll("text.name")
    .data(data)
    .enter()
    .append("text")
    .attr("x", 0)
    .attr("y", function(d, i){ return y(d.State) + bar_height/2 + gap; })
    .attr("stroke", "#FFFAFA")
    .attr("dx", -120)
    .attr("dy", ".36em")
    .attr("font-family", "sans-serif")
    .text(function(d){ return d.State; });

  });
}
