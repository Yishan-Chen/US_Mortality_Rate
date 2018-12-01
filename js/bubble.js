dataset1999 = {
  "children": [{"State":"California","Deaths":229380},
      {"State":"Florida","Deaths":163224},
      {"State":"New York","Deaths":159927},
      {"State":"Texas","Deaths":146858},
      {"State":"Pennsylvania","Deaths":130283},
      {"State":"Ohio","Count":108517},
      {"State":"Illinois","Deaths":108436},
      {"State":"Michigan","Deaths":87232},
      {"State":"New Jersey","Deaths":73981},
      {"State":"North Carolina","Deaths":69600},
      {"State":"Georgia","Deaths":62028},
      {"State":"Missouri","Deaths":55931},
      {"State":"Massachusetts","Deaths":55840},
      {"State":"Virginia","Deaths":55320},
      {"State":"Indiana","Deaths":55303},
      {"State":"Tennessee","Deaths":53765},
      {"State":"Wisconsin","Deaths":46672},
      {"State":"Alabama","Deaths":44806},
      {"State":"Washington","Deaths":43865},
      {"State":"Maryland","Deaths":43089},
      {"State":"Louisiana","Deaths":41238},
      {"State":"Arizona","Deaths":40050},
      {"State":"Kentucky","Deaths":39321},
      {"State":"Minnesota","Deaths":38537},
      {"State":"South Carolina","Deaths":36053},
      {"State":"Oklahoma","Deaths":34700},
      {"State":"Connecticut","Deaths":29446},
      {"State":"Oregon","Deaths":29422},
      {"State":"Iowa","Deaths":28411},
      {"State":"Mississippi","Deaths":28185},
      {"State":"Arkansas","Deaths":27925},
      {"State":"Colorado","Deaths":27114},
      {"State":"Kansas","Deaths":24472},
      {"State":"West Virginia","Deaths":21049},
      {"State":"Nebraska","Deaths":15579},
      {"State":"Nevada","Deaths":15082},
      {"State":"New Mexico","Deaths":13676},
      {"State":"Maine","Deaths":12261},
      {"State":"Utah","Deaths":12058},
      {"State":"Rhode Island","Deaths":9708},
      {"State":"Idaho","Deaths":9579},
      {"State":"New Hampshire","Deaths":9537},
      {"State":"Hawaii","Deaths":8270},
      {"State":"Montana","Deaths":8128},
      {"State":"South Dakota","Deaths":6953},
      {"State":"Delaware","Deaths":6666},
      {"State":"North Dakota","Deaths":6103},
      {"State":"District of Columbia","Deaths":6076},
      {"State":"Vermont","Deaths":4993},
      {"State":"Wyoming","Deaths":4042},
      {"State":"Alaska","Deaths":2708}
    ]
};

dataset2000 = {
  "children": [{"State":"California","Deaths":22},
      {"State":"Florida","Deaths":163224},
      {"State":"New York","Deaths":159927},
      {"State":"Texas","Deaths":146858},
      {"State":"Pennsylvania","Deaths":130283},
      {"State":"Ohio","Count":108517},
      {"State":"Illinois","Deaths":108436},
      {"State":"Michigan","Deaths":87232},
      {"State":"New Jersey","Deaths":73981},
      {"State":"North Carolina","Deaths":69600},
      {"State":"Georgia","Deaths":62028},
      {"State":"Missouri","Deaths":55931},
      {"State":"Massachusetts","Deaths":55840},
      {"State":"Virginia","Deaths":55320},
      {"State":"Indiana","Deaths":55303},
      {"State":"Tennessee","Deaths":53765},
      {"State":"Wisconsin","Deaths":46672},
      {"State":"Alabama","Deaths":44806},
      {"State":"Washington","Deaths":43865},
      {"State":"Maryland","Deaths":43089},
      {"State":"Louisiana","Deaths":41238},
      {"State":"Arizona","Deaths":40050},
      {"State":"Kentucky","Deaths":39321},
      {"State":"Minnesota","Deaths":38537},
      {"State":"South Carolina","Deaths":36053},
      {"State":"Oklahoma","Deaths":34700},
      {"State":"Connecticut","Deaths":29446},
      {"State":"Oregon","Deaths":29422},
      {"State":"Iowa","Deaths":28411},
      {"State":"Mississippi","Deaths":28185},
      {"State":"Arkansas","Deaths":27925},
      {"State":"Colorado","Deaths":27114},
      {"State":"Kansas","Deaths":24472},
      {"State":"West Virginia","Deaths":21049},
      {"State":"Nebraska","Deaths":15579},
      {"State":"Nevada","Deaths":15082},
      {"State":"New Mexico","Deaths":13676},
      {"State":"Maine","Deaths":12261},
      {"State":"Utah","Deaths":12058},
      {"State":"Rhode Island","Deaths":9708},
      {"State":"Idaho","Deaths":9579},
      {"State":"New Hampshire","Deaths":9537},
      {"State":"Hawaii","Deaths":8270},
      {"State":"Montana","Deaths":8128},
      {"State":"South Dakota","Deaths":6953},
      {"State":"Delaware","Deaths":6666},
      {"State":"North Dakota","Deaths":6103},
      {"State":"District of Columbia","Deaths":6076},
      {"State":"Vermont","Deaths":4993},
      {"State":"Wyoming","Deaths":4042},
      {"State":"Alaska","Deaths":2708}
    ]
};

function bubbleChart(year){
  var width = 1000,
      height = 500;

  var bubblesvg = d3.select("#bubble").append("svg")
  .attr("id", "bubbleC")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var diameter = 500;

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
    var range = ["#ffd8d8", "#910000"];
    var domain = d3.extent(data, function(d){
      return d.Deaths;
    });
    var color = d3.scaleLinear()
    .domain(domain)
    .range(range);

    if(year === "1999"){
      var bubble = d3.pack(dataset1999)
      .size([diameter, diameter])
      .padding(1.5);

      var nodes = d3.hierarchy(dataset1999)
      .sum(function(d) { return d.Deaths; });
    }

    if(year === "2000"){
      var bubble = d3.pack(dataset2000)
      .size([diameter, diameter])
      .padding(1.5);

      var nodes = d3.hierarchy(dataset2000)
      .sum(function(d) { return d.Deaths; });
    }

    var node = bubblesvg.selectAll(".node")
    .data(bubble(nodes).descendants())
    .enter()
    .filter(function(d){ return  !d.children;})
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d){ return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
    .text(function(d) {return d.data.State + ": " + d.data.Deaths;});

    node.append("circle")
    .attr("r", function(d){ return d.r; })
    .style("fill", function(d) {return color(d.data.Deaths);});

    node.append("text")
    .attr("dy", ".2em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.data.State.substring(0, d.r / 3);})
    .attr("font-family", "sans-serif")
    .attr("font-size", function(d){return d.r/5;})
    .attr("fill", "white");
  /*
    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.Count;
        })
        .attr("font-family",  "Gill Sans", "Gill Sans MT")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");
  */
    d3.select(self.frameElement)
    .style("height", diameter + "px");
  });

}
