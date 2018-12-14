function compareBarChart(year1, year2, state1, state2){
  var margin = {top: 10, right: 20, bottom: 100, left: 120};

  var width = 1400 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  var barsvg = d3.select("#barchart").append("svg")
  .attr("id", "barChartC")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x0 = d3.scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1);

  var x1 = d3.scaleBand()
  .padding(0.05);

  var y = d3.scaleLinear()
  .rangeRound([height, 0]);

  var color = d3.scaleOrdinal()
  .range(["#87CEFA","#ffd8d8"]);

  var tooltip = d3.select("#tooltip-container").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0.9);

  d3.csv('data/NCHS_-_Leading_Causes_of_Death__United_States.csv', function(error, data) {
    var data1 = data.filter(data => data.Year === year1 && data.State === state1 && data.CauseName !== "All causes");
    data1.forEach(function(d) {
      d.CauseName = d.CauseName;
      d.Deaths = +d.Deaths;
    });

    var data2 = data.filter(data => data.Year === year2 && data.State === state2 && data.CauseName !== "All causes");
    data2.forEach(function(d) {
      d.CauseName = d.CauseName;
      d.Deaths = +d.Deaths;
    });

    var keys = [];
    keys.push(year1+state1);
    keys.push(year2+state2);

    var data = data1.concat(data2);

    maxDeath = d3.max(data, d => d.Deaths)
    console.log(maxDeath);

    x0.domain(data.map(function(d){ return d.CauseName;}));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, maxDeath]);
    color.domain(keys[1],keys[0]);

    barsvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x0));
    barsvg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
    .attr("x", 2)
    .attr("y", y(y.ticks().pop()) + 0.5)
    .attr("dy", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text("Population");

    barsvg.selectAll(".rect1")
    .data(data1)
    .enter()
    .append("rect")
    .attr("class", "rect1")
    .attr("x", function(d){ return x0(d.CauseName);})
    .attr("y", function(d){ return y(0);})
    .attr("width", x1.bandwidth())
    .attr("height", function(d) { return height - y(0); })
    .attr("fill", function(d) { return color(d.Year + d.State); });

    barsvg.selectAll(".rect1")
    .transition()
    .delay(function (d) {return Math.random()*1000;})
    .duration(1000)
    .attr("y", function(d) { return y(d.Deaths); })
    .attr("height", function(d) { return height - y(d.Deaths); });

    barsvg.selectAll(".rect2")
    .data(data2)
    .enter()
    .append("rect")
    .attr("class", "rect2")
    .attr("transform", function(d) { return "translate(55,0)"; })
    .attr("x", function(d){ return x0(d.CauseName);})
    .attr("y", function(d){ return y(0);})
    .attr("width", x1.bandwidth())
    .attr("height", function(d) { return height - y(0); })
    .attr("fill", function(d) { return color(d.Year + d.State); });

    barsvg.selectAll(".rect2")
    .transition()
    .delay(function (d) {return Math.random()*1000;})
    .duration(1000)
    .attr("y", function(d) { return y(d.Deaths); })
    .attr("height", function(d) { return height - y(d.Deaths); });

  });
}
