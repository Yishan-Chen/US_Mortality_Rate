dataset = {
  "children": [{"Year":"1999","Deaths":2391399},
      {"Year":"2000","Deaths":2403351},
      {"Year":"2001","Deaths":2416425},
      {"Year":"2002","Deaths":2443387},
      {"Year":"2003","Deaths":2448288},
      {"Year":"2004","Deaths":2397615},
      {"Year":"2005","Deaths":2448017},
      {"Year":"2006","Deaths":2426264},
      {"Year":"2007","Deaths":2423712},
      {"Year":"2008","Deaths":2471984},
      {"Year":"2009","Deaths":2437163},
      {"Year":"2010","Deaths":2468435},
      {"Year":"2011","Deaths":2515458},
      {"Year":"2012","Deaths":2543279},
      {"Year":"2013","Deaths":2596993},
      {"Year":"2014","Deaths":2626418},
      {"Year":"2015","Deaths":2712630},
      {"Year":"2016","Deaths":2319475}
    ]
};

var diameter = 500;

var selected = "all";
var sortFlag = false;
stackBarChart(sortFlag);
bubbleChart();
addText(selected);

function stackBarChart(flag) {
  var margin = {top: 20, right: 20, bottom: 20, left: 120};

  var width = 1400 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  var stacksvg = d3.select("#stack").append("svg")
  .attr("id", "stackBar")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
  .rangeRound([0, 1000])
  .paddingInner(0.4)
  .align(0.2);

  var y = d3.scaleLinear()
  .rangeRound([height, 0]);

  csvfile = "data/NCHS_-_Leading_Causes_of_Death__United_States_time.csv";
  d3.csv(csvfile, function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  }, function(error, data) {
    if (error) throw error;

    var keys = data.columns.slice(1);

    //var z = d3.scaleSequential(d3.interpolateBlues)
    //.domain([0, 100000]);

    if(flag){
      data.sort(function(a, b) { return b.total - a.total; });
    }

    //data.sort(function(a, b) { return b.total - a.total; });
    x.domain(data.map(function(d) { return d.Year; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();

    var z = d3.scaleOrdinal(d3.schemeCategory20c)
    .domain(["Alzheimer's disease","Cancer","CLRD","Diabetes","Heart disease","Influenza and pneumonia","Kidney disease","Stroke","Suicide","Unintentional injuries","other"]);

    stacksvg.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
    .attr("fill", function(d) { return z(d.key); })
    .style("opacity", 0.8)
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) { return x(d.data.Year); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    .attr("width", x.bandwidth())
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0] - 30;
        //var yPosition = d3.mouse(this)[1] + 20;
      var yPosition = 20;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d[1]-d[0]);
    });
/*
    stacksvg.selectAll("rect")
    .transition()
    .delay(function (d) {return Math.random()*1000;})
    .duration(1000)
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); });
*/
    stacksvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    stacksvg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
    .attr("x", 2)
    .attr("y", y(y.ticks().pop()) + 0.5)
    .attr("dy", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start");

    var legend = stacksvg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .attr("stroke", "#FFFAFA")
        .text(function(d) { return d; });
  });

    // Prep the tooltip bits, initial display is hidden
    var tooltip = stacksvg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    tooltip.append("rect")
      .attr("width", 60)
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity",0.8);

    tooltip.append("text")
      .attr("x", 30)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");
}


function addText(select){
  var margin = {top: 20, right: 50, bottom: 20, left: 50};
  var width = 1400,
      height = 70;

  var textsvg = d3.select("#textDiv").append("svg")
  .attr("id", "textT")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var targetYear;
  var targetDeaths = 0;
  var total = 0;
  var csvFile = "data/NCHS_-_Leading_Causes_of_Death__United_States.csv";
  d3.csv(csvFile, function (error, csv) {
    if(error){
      throw error;
    } else {
      var data = csv.filter(csv => csv.State === "United States" && csv.CauseName === "All causes");
      data.forEach(function(d){
        d.Year = d.Year;
        d.Deaths = parseFloat(d.Deaths);
        total = total + d.Deaths;
        if(d.Year === select){
          targetYear = select;
          targetDeaths = d.Deaths;
          console.log(targetDeaths)
        }
        if (select === "all") {
          targetYear = "From 1999 to 2016";
          targetDeaths = total;
        }
      });
      textsvg.append("text")
      .attr("y", 0)
      .attr("x",800)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", 30)
      .style("font-family", "Times New Roman")
      .text(targetYear + ": " + targetDeaths)
      .style("stroke", "#FFFAFA");

    }
  });
}

function bubbleChart(){
  var margin = {top: 20, right: 50, bottom: 0, left: 50};
  var width = 550,
      height = 550;

  var bubblesvg = d3.select("#bubbleDiv").append("svg")
  .attr("id", "bubbleT")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var csvFile = "data/NCHS_-_Leading_Causes_of_Death__United_States.csv";
  d3.csv(csvFile, function (error, csv) {
    if(error){
      throw error;
    } else {
      var data = csv.filter(csv => csv.State === "United States" && csv.CauseName === "All causes");
      data.forEach(function(d){
        d.Year = d.Year;
        d.Deaths = parseFloat(d.Deaths);
      });
    }

    var colorScale = d3.scaleOrdinal(d3.schemeCategory20c);

    var bubble = d3.pack(dataset)
    .size([diameter, diameter])
    .padding(1.5);

    var nodes = d3.hierarchy(dataset)
    .sum(function(d) { return d.Deaths; });

    var node = bubblesvg.selectAll(".node")
    .data(bubble(nodes).descendants())
    .enter()
    .filter(function(d){ return  !d.children;})
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d){ return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
    .text(function(d) {return d.data.Year;});

    node.append("circle")
    .attr("class", "topBubble")
    .attr("id", function(d){return d.data.Year;})
    .attr("r", function(d){ return d.r; })
    .style("opacity", 0.8)
    .style("fill", function(d){ return colorScale(d.data.Deaths); })
    .on("click", handleMouse);

    node.append("text")
    .attr("class", "topBubbleText")
    .attr("dy", ".2em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.data.Deaths;})
    .attr("font-family", "sans-serif")
    .attr("font-size", function(d){return d.r/4.5;})
    .attr("fill", "white");

    d3.select(self.frameElement)
    .style("height", diameter + "px");

  });
}

function handleMouse(d, i){
  if(d3.select(this)){
    selected = this.id;
    d3.selectAll("#textT").remove();
    addText(selected);
  }
}

function resetChart(){
  selected = "all";
  sortFlag = false;
  d3.selectAll("#stackBar").remove();
  d3.selectAll("#textT").remove();
  stackBarChart(sortFlag);
  addText(selected);
}

function sortChart(){
  selected = "all";
  var sortFlag = true;
  d3.selectAll("#stackBar").remove();
  stackBarChart(sortFlag);
}

document.getElementById("cancel").addEventListener("click", resetChart);
document.getElementById("sort").addEventListener("click", sortChart);
