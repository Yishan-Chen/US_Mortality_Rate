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
total(selected, sortFlag);
bubbleChart();
addText(selected);

function total(select, flag){
  var margin = {top: 50, right: 50, bottom: 50, left: 100};

  var width = 1300 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var totalsvg = d3.select("#totalbar").append("svg")
  .attr("id", "total")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var csvFile = "data/NCHS_-_Leading_Causes_of_Death__United_States.csv";
  d3.csv(csvFile, function (error, data) {
    if(error){
      throw error;
    } else {
      var filter_data = data.filter(data => data.CauseName === "All causes" && data.State === "United States")
      filter_data.forEach(function(d){
        d.Year = d.Year;
        d.Deaths = +d.Deaths;
      })

      if(flag) {
        filter_data.sort(function(a, b) { return b.Deaths - a.Deaths; });
      }

      var x = d3.scaleBand()
      .domain(filter_data.map(function(d){ return d.Year; }))
      .rangeRound([0, width], .1)
      .padding(0.5);

      let maxDeath = d3.max(filter_data, d => d.Deaths);

      var y = d3.scaleLinear()
      .domain([0, maxDeath + 100000])
      .range([height, 0]);

      totalsvg.append("g")
      .transition()
      .duration(1000)
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .style("stroke", "white");

      totalsvg.append("g")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y))
      .style("stroke", "white");

      totalsvg.selectAll("text")
      .attr("dy", ".36em")
      .attr("dx", "-2em")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")

      totalsvg.selectAll("rect")
      .data(filter_data)
      .enter()
      .append("circle")
      //.transition()
      //.duration(1000)
      //.delay(function(d, i) { return i * 30; })
      .attr("class", "circles")
      .attr("r", function(d){
        if(select === "all"){return 10} else {
          if(select === d.Year){return 20;} else {return 10;}
        }
      })
      .attr("cx", function(d){ return x(d.Year); })
      .attr("cy", function(d){ return y(d.Deaths); })
      .style("opacity", function(d){
        if(select === "all"){return 0.7} else {
          if(select === d.Year){return 1.0;} else {return 0.2;}
        }
      })
      .attr("fill", "#FFFAFA");

      totalsvg.append("text")
      .attr("y", 0)
      .attr("x",0 + margin.right)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", 15)
      .text("Total Deaths")
      .style("stroke", "#FFFAFA");

      totalsvg.selectAll("#lines")
      .data(data)
      .enter()
      .append("line")
      .style("id", "lines")
      .style("stroke-dasharray", ("3, 3"))
      .attr("x1", function(d){ return x(d.Year); })
      .attr("x2", function(d){ return x(d.Year); })
      .attr("y1", 100)
      .attr("y2", function(d){ return y(d.Deaths);})
      .style("stroke", "#A9A9A9");

      /*
      totalsvg.selectAll(".bar")
      .data(filter_data)
      .enter()
      .append("rect")
      .transition()
      .duration(1000)
      //.delay(function(d, i) { return i * 30; })
      .attr("class", "bar")
      .attr("x", function(d){ return x(d.Year); })
      .attr("width", x.bandwidth())
      .attr("y", function(d){ return y(d.Deaths); })
      .attr("height", function(d){ return height - y(d.Deaths); })
      .style("opacity", function(d){
        if(select === "all"){return 0.7} else {
          if(select === d.Year){return 1.0;} else {return 0.2;}
        }
      })
      .attr("fill", "#FFFAFA");

      totalsvg.append("text")
      .attr("y", 0)
      .attr("x",0 + margin.right*2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", 15)
      .text("Total Deaths")
      .style("stroke", "#FFFAFA");

      */
    }
  });
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

    var range = ["#ffd8d8", "#910000"];
    var domain = d3.extent(data, function(d){
      return d.Deaths;
    });
    var colorScale = d3.scaleLinear()
    .domain(domain)
    .range(range);

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
    .attr("font-size", function(d){return d.r/4;})
    .attr("fill", "white");

    d3.select(self.frameElement)
    .style("height", diameter + "px");

  });
}

function handleMouse(d, i){
  if(d3.select(this)){
    selected = this.id;
    d3.selectAll("#total").remove();
    d3.selectAll("#textT").remove();
    total(selected);
    addText(selected);
  }
}

function resetChart(){
  selected = "all";
  sortFlag = false;
  d3.selectAll("#total").remove();
  d3.selectAll("#textT").remove();
  total(selected, sortFlag);
  addText(selected);
}

function sortChart(){
  selected = "all";
  var sortFlag = true;
  d3.selectAll("#total").remove();
  total(selected, sortFlag);
}

document.getElementById("cancel").addEventListener("click", resetChart);
document.getElementById("sort").addEventListener("click", sortChart);
