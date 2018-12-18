
var margin = {top: 20, right: 20, bottom: 20, left: 20};

var width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var graphSvg = d3.select("#canvas-svg").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var SCALE = 1;
var projection = d3.geoAlbersUsa().translate([width/2.5, height/3]).scale(700);
var path = d3.geoPath().projection(projection);

$(function(){
  var data = d3.range(0, 18).map(function (d) { return new Date(1998 + d, 18, 3); });
  var yearNumber = "1999"
  var slider = d3.sliderHorizontal()
  .min(d3.min(data))
  .max(d3.max(data))
  .step(1000 * 60 * 60 * 24 * 365)
  .width(1500)
  .tickFormat(d3.timeFormat('%Y'))
  .tickValues(data)
  .on('onchange', val => {
    yearNumber = String(d3.timeFormat('%Y')(val));
    states = [];
    d3.selectAll("#selectB").remove();
    updateGraph(yearNumber);
    selectPieChart(yearNumber,states);
  });

var group = d3.select("div#slider").append("svg")
  .attr("width", 1600)
  .attr("height", 100)
  .append("g")
  .attr("transform", "translate(30,30)");

group.call(slider);

var states = [];
updateGraph("1999");
selectPieChart(yearNumber,states);
cumulativeBarChart(yearNumber,states)

function updateGraph(year){
  d3.tsv("https://s3-us-west-2.amazonaws.com/vida-public/geo/us-state-names.tsv", function(error, names) {
    name_id_map = {};
    id_name_map = {};
    for (var i = 0; i < names.length; i++) {
      name_id_map[names[i].name] = names[i].id;
      id_name_map[names[i].id] = names[i].name;
    }

    d3.csv("data/NCHS_-_Leading_Causes_of_Death__United_States.csv",function(data){
      state_color_map = {}
      state_value_map = {}
      var filter_data = data.filter(data => data.Year === year && data.State !== "United States" && data.CauseName == "All causes");
      filter_data.forEach(function(d) {
          state_value_map[d.State] = +d["Deaths"];
      });
      var data_entries = d3.entries(state_value_map);

      d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json", function(error, us) {
        var map = graphSvg.append("g")
          .attr("class", "states-choropleth")
          .selectAll("path")
          .attr("width", 400)
          .attr("height", 400)
          .data(topojson.feature(us, us.objects.states).features)
          .enter().append("path")
          .attr("transform", "scale(" + SCALE + ")")
            .attr("d", path)
            .style("fill", "#696969")
            .on("click", function(d){
              var stateName = id_name_map[d.id];
               $(this).css({ fill: "#770000" });
               mouseOperation(stateName);
             });

        graphSvg.append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("class", "states")
            .attr("transform", "scale(" + SCALE + ")")
            .attr("d", path);
          });
        });

      });
    }

    function mouseOperation(state){
      states.push(state);
      d3.selectAll("#selectB").remove();
      selectPieChart(yearNumber,states);
      cumulativeBarChart(yearNumber,states);
    }

});
