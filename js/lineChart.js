//compareLineChart();

function compareLineChart(year1, year2, state1, state2){
  var margin = {top: 10, right: 20, bottom: 100, left: 120};

  var width = 1400 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  var linechartsvg = d3.select("#linechart").append("svg")
  .attr("id", "lineChart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

    var max1 = d3.max(data1, d => d.Deaths)
    var max2 = d3.max(data2, d => d.Deaths)

    var tooltip = d3.select("#linechart")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("top", "2100px")
    .style("left", "55px")
    .style("stroke", "white")
    .style("background", "white");
/*
    var totaldata = data.filter(data => data.Year === year1 || data.Year === year2 && data.State === (state1 || state2) && data.CauseName !== "All causes");
    totaldata.forEach(function(d) {
      d.CauseName = d.CauseName;
      d.Deaths = +d.Deaths;
    });
*/
    var x = d3.scaleBand()
    .domain(["Alzheimer's disease","Cancer","CLRD","Diabetes","Heart disease","Influenza and pneumonia","Kidney disease","Stroke","Suicide","Unintentional injuries"])
    .rangeRound([0, width], .1)
    .padding(0.5);

    if(max1 > max2) {
      var y = d3.scaleLinear()
      .domain([0, d3.max(data1, d => d.Deaths)])
      .range([height, 0])
    }

    if(max1 < max2) {
      var y = d3.scaleLinear()
      .domain([0, d3.max(data2, d => d.Deaths)])
      .range([height, 0])
    }

    linechartsvg.append("g")
    .attr("class", "xA")
    //.transition()
    //.duration(1000)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .style("stroke", "white");

    linechartsvg.append("g")
    //.transition()
    //.duration(1000)
    .call(d3.axisLeft(y))
    .style("stroke", "white");

    linechartsvg.selectAll("text")
    //.attr("dy", "36em")
    .attr("dx", "-1em")
    //.attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

    linechartsvg.selectAll(".xA text")
    .attr("dy", "-.36em")
    .attr("transform", "rotate(-45)");

    var valueLine = d3.line()
    .x(function(d){ return x(d.CauseName);})
    .y(function(d){ return y(d.Deaths);})

    linechartsvg.append("path")
    .datum(data1)
    .attr("fill", "none")
    .attr("stroke", "#FF0000")
    .attr("stroke-width", 2)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .style("opacity", 0.8)
    .attr("d", valueLine);

    linechartsvg.append("path")
    .datum(data2)
    .attr("fill", "none")
    .attr("stroke", "#1E90FF")
    .attr("stroke-width", 2)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .style("opacity", 0.8)
    .attr("d", valueLine);

    var vertical = d3.select("#linechart")
    .append("div")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "19")
    .style("width", "1px")
    .style("height", "600px")
    .style("top", "2050px")
    .style("bottom", "2800px")
    .style("left", "100px")
    .style("right", "1200px")
    .style("stroke", "white")
    .style("background", "#fff");

    d3.select("#linechart")
    .on("mousemove", function(d){
        mousex = d3.mouse(this);
        mousex = mousex[0] + 5;
        mousetool = mousex + 10;
        var invertedx = x.invert(mousex);
        console.log(invertedx)
        vertical.style("left", mousex + "px")
        tooltip.html( "<p>" +  + "</p>").style("left", mousetool +"px").style("visibility", "visible")
      })
    .on("mouseover", function(){
        mousex = d3.mouse(this);
        mousex = mousex[0] + 5;
        mousetool = mousex + 10;
        vertical.style("left", mousex + "px")});
        tooltip.html( "<p>" + "good" + "</p>").style("left", mousetool +"px").style("visibility", "visible")
  });
}
