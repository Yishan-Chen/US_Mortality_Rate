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
defaultPieChart();
bubbleChart();
addText(selected);

function stackBarChart(flag) {
  var margin = {top: 20, right: 20, bottom: 80, left: 120};

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

    if(flag){
      data.sort(function(a, b) { return b.total - a.total; });
    }

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
      var yPosition = 20;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d[1]-d[0]);
    });

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
    .attr("stroke", "#FFFAFA")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start");

    var legend = stacksvg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 15)
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
        .attr("fill", "white")
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
  var margin = {top: 20, right: 120, bottom: 20, left: 20};
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
        }
        if (select === "all") {
          targetYear = "From 1999 to 2016";
          targetDeaths = total;
        }
      });
      textsvg.append("text")
      .attr("y", 0)
      .attr("x",250)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", 30)
      .style("font-family", "Times New Roman")
      .text("Year " + targetYear + " Death Number: " + targetDeaths)
      .style("stroke", "#FFFAFA")
      .style("fill", "white");
    }
  });
}

function defaultPieChart(){
  var margin = {top: 60, right: 170, bottom: 0, left: 230};

  var width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var piesvg = d3.select("#piechart").append("svg")
  .attr("id", "pieChartC")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")");

  var csvFile = "data/NCHS_-_Leading_Causes_of_Death__United_States_total.csv";
  d3.csv(csvFile, function (error, data) {
    if(error){
      throw error;
    } else {
      var total = 0;
      data.forEach(function(d){
        d.CauseName = d.CauseName;
        d.Deaths = +d.Deaths;
        total = total + d.Deaths;
      })
      var cornerRadius = 3;
      var padAngle = 0.015;
      var floatFormat = d3.format('.4r');
      var percentFormat = d3.format(',.2%');

      var colorScale = d3.scaleOrdinal(d3.schemeCategory20c)
      .domain(["Alzheimer's disease","Cancer","CLRD","Diabetes","Heart disease","Influenza and pneumonia","Kidney disease","Stroke","Suicide","Unintentional injuries","other"]);

      var radius = Math.min(width, height) / 2;

      var pie = d3.pie()
      .value(function(d) { return floatFormat(d.Deaths/total); })
      .sort(null);

      var arc = d3.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.6)
      .cornerRadius(cornerRadius)
      .padAngle(padAngle);

      var outerArc = d3.arc()
      .outerRadius(radius * 0.9)
      .innerRadius(radius * 0.9);

      piesvg.append('g').attr('class', 'slices');
      piesvg.append('g').attr('class', 'labelName');
      piesvg.append('g').attr('class', 'lines');

      var slice = piesvg.select('.slices')
      .datum(data)
      .selectAll('path')
      .data(pie(data))
      .enter().append('path')
      .transition()
      .duration(1000)
      .attr('fill', function(d) { return colorScale(d.data.CauseName); })
      .attr('d', arc);

      d3.selectAll(".slices").exit().remove();

      var label = piesvg.select('.labelName').selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('dy', '.35em')
      .style("stroke", "#FFFAFA")
      .html(function(d) {
          return d.data.CauseName + ': <tspan>' + percentFormat(floatFormat(d.data.Deaths/total)) + '</tspan>';
      })
      .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
       })
        .style('text-anchor', function(d) {
         return (midAngle(d)) < Math.PI ? 'start' : 'end';
       });

      label.exit().remove();

      function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

      var polyline = piesvg.select('.lines')
      .selectAll('polyline')
      .data(pie(data))
      .enter().append('polyline')
      .attr('points', function(d) {
        var pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos]
      });

      polyline.exit().remove();

      d3.selectAll('.labelName text, .slices path').call(toolTip);

      function toolTip(selection) {
          selection.on('mouseenter', function (data) {
              piesvg.append('text')
              .attr('class', 'toolCircle')
              .attr('dy', -15)
              .html(toolTipHTML(data))
              .style('font-size', '1em')
              .style('text-anchor', 'middle')
              .style("stroke", "#FFFAFA");
              piesvg.append('circle')
              .attr('class', 'toolCircle')
              .attr('r', radius * 0.55)
              .style('fill', colorScale(data.data.CauseName))
              .style('fill-opacity', 0.35);
          });
          selection.on('mouseout', function () {
              d3.selectAll('.toolCircle').remove();
          });
      }

      function toolTipHTML(data) {
          var tip = '',
              i   = 0;
          for (var key in data.data) {
            if(key === "CauseName" || key === "Deaths")
            {
              var value = data.data[key];
              if (i === 0) tip += '<tspan x="0">' + key + ': ' + value + '</tspan>';
              else tip += '<tspan x="0" dy="1.2em">' + key + ': ' + value + '</tspan>';
              i++;
            }
          }
          return tip;
      }

    }
  });
}

function pieChart(year){
  var margin = {top: 20, right: 170, bottom: 0, left: 230};

  var width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var piesvg = d3.select("#piechart").append("svg")
  .attr("id", "pieChartC")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")");

  var csvFile = "data/NCHS_-_Leading_Causes_of_Death__United_States.csv";
  d3.csv(csvFile, function (error, csv) {
    if(error){
      throw error;
    } else {
      var total = 0;
      var data = csv.filter(csv => csv.Year === year && csv.State === "United States" && csv.CauseName !== "All causes");
      data.forEach(function(d){
        d.CauseName = d.CauseName;
        d.Deaths = +d.Deaths;
        total = total + d.Deaths;
      });

      var cornerRadius = 3;
      var padAngle = 0.015;
      var floatFormat = d3.format('.4r');
      var percentFormat = d3.format(',.2%');

      var colorScale = d3.scaleOrdinal(d3.schemeCategory20c)
      .domain(["Alzheimer's disease","Cancer","CLRD","Diabetes","Heart disease","Influenza and pneumonia","Kidney disease","Stroke","Suicide","Unintentional injuries","other"]);

      var radius = Math.min(width, height) / 2;

      var pie = d3.pie()
      .value(function(d) { return floatFormat(d.Deaths/total); })
      .sort(null);

      var arc = d3.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.6)
      .cornerRadius(cornerRadius)
      .padAngle(padAngle);

      var outerArc = d3.arc()
      .outerRadius(radius * 0.9)
      .innerRadius(radius * 0.9);

      piesvg.append('g').attr('class', 'slices');
      piesvg.append('g').attr('class', 'labelName');
      piesvg.append('g').attr('class', 'lines');

      var slice = piesvg.select('.slices')
      .datum(data)
      .selectAll('path')
      .data(pie(data))
      .enter().append('path')
      .transition()
      .duration(1000)
      .attr('fill', function(d) { return colorScale(d.data.CauseName); })
      .attr('d', arc);

      d3.selectAll(".slices").exit().remove();

      var label = piesvg.select('.labelName').selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('dy', '.35em')
      .style("stroke", "#FFFAFA")
      .html(function(d) {
          return d.data.CauseName + ': <tspan>' + percentFormat(floatFormat(d.data.Deaths/total)) + '</tspan>';
      })
      .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
       })
        .style('text-anchor', function(d) {
         return (midAngle(d)) < Math.PI ? 'start' : 'end';
       });

      label.exit().remove();

      function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

      var polyline = piesvg.select('.lines')
      .selectAll('polyline')
      .data(pie(data))
      .enter().append('polyline')
      .attr('points', function(d) {
        var pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos]
      });

      polyline.exit().remove();

      d3.selectAll('.labelName text, .slices path').call(toolTip);

      function toolTip(selection) {
          selection.on('mouseenter', function (data) {
              piesvg.append('text')
              .attr('class', 'toolCircle')
              .attr('dy', -15)
              .html(toolTipHTML(data))
              .style('font-size', '1em')
              .style('text-anchor', 'middle')
              .style("stroke", "#FFFAFA");
              piesvg.append('circle')
              .attr('class', 'toolCircle')
              .attr('r', radius * 0.55)
              .style('fill', colorScale(data.data.CauseName))
              .style('fill-opacity', 0.35);
          });
          selection.on('mouseout', function () {
              d3.selectAll('.toolCircle').remove();
          });
      }

      function toolTipHTML(data) {
          var tip = '',
              i   = 0;
          for (var key in data.data) {
            if(key === "CauseName" || key === "Deaths")
            {
              var value = data.data[key];
              if (i === 0) tip += '<tspan x="0">' + key + ': ' + value + '</tspan>';
              else tip += '<tspan x="0" dy="1.2em">' + key + ': ' + value + '</tspan>';
              i++;
            }
          }
          return tip;
      }

    }
  });
}

function bubbleChart(){
  var margin = {top: 20, right: 170, bottom: 50, left: 50};
  var width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var bubblesvg = d3.select("#bubbleDiv").append("svg")
  .attr("id", "bubbleChart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" +  margin.left + "," + margin.top + ")");

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
    .text(function(d) {return "Year " + d.data.Year;});

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
    .attr("font-size", function(d){return d.r/3.5;})
    .attr("fill", "white");

    d3.select(self.frameElement)
    .style("height", diameter + "px");

  });
}

function handleMouse(d, i){
  if(d3.select(this)){
    selected = this.id;
    d3.selectAll("#textT").remove();
    d3.select("#pieChartC").remove();
    addText(selected);
    pieChart(selected);
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
