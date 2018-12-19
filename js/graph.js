var margin = {top: 50, right: 0, bottom: 50, left: 0};

var width = 1100 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var scaleDomain = [0,40000,80000,120000,160000,200000,240000];
var scaleRange = ["#ffd8d8", "f9acac", "#dd5a5a", "d33d3d","#b21010","#910000"];

var scaleChartHeight = 30;
var rectWidth = 50;

var rectScale = d3.scaleLinear()
                  .domain([0, 11])
                  .range([0,width]);

// var scaleSvg = d3.select("#canvas-svg").append('svg')
//                    .attr('width', width)
//                    .attr('height', 40)
//                    .append('g')
//                    .attr("transform", "translate(" + this.margin.left + ",0)");

// scaleSvg.selectAll('rect')
//             .data(scaleRange)
//             .enter()
//             .append('rect')
//             .attr('x', function(d,i){return rectScale(i);})
//             .attr('y', 0)
//             .attr('width', rectWidth)
//             .attr('height', 10)
//             .attr('fill', function(d){return d});

// scaleSvg.selectAll('text')
//     .data(range)
//     .enter()
//     .append('text')
//     .attr('x', function(d,i){return rectScale(i);})
//     .attr('y', scaleChartHeight+30)
//     .text(function(d,i) {return scaleDomain[i] + ' to ' + scaleDomain[i+1]})
//     .attr('fill', 'white');

var graphSvg = d3.select("#canvas-svg").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var SCALE = 1;
var projection = d3.geoAlbersUsa();
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
  resetGraph();
  backGraph();
  d3.selectAll("#barChart").remove();
  yearNumber = String(d3.timeFormat('%Y')(val));
  updateGraph(yearNumber)
  barChart(yearNumber, filterFlag);
});

var filterFlag = false;
var group = d3.select("div#slider").append("svg")
.attr("width", 1600)
.attr("height", 100)
.append("g")
.attr("transform", "translate(30,30)");

group.call(slider);

updateGraph("1999", filterFlag);
barChart("1999", filterFlag);

function updateGraph(year, flag){
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
      var selectedState = document.getElementById("inputBoxState").value;
      var data_entries = d3.entries(state_value_map);
      var range = ["#ffd8d8","#910000"];
      var domain = d3.extent(data_entries, function(d){
        return d.value;
      });
      colorScale = d3.scaleLinear().domain(domain).range(range);

      if(flag) {
        var maxValue = parseFloat(document.getElementById("inputBoxMax").value);
        var minValue = parseFloat(document.getElementById("inputBoxMin").value);
        var selected_data = filter_data.filter(data => data.Deaths > minValue && data.Deaths < maxValue);
      }

      data_entries.forEach(function(d) {
        state_color_map[d.key] = colorScale(d.value);
      });
      d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json", function(error, us) {
        graphSvg.append("g")
        .attr("class", "states-choropleth")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
        .append("path")
        .attr("transform", "scale(" + SCALE + ")")
        .style("fill", function(d) {
            var stateName = id_name_map[d.id];
            if(stateName === selectedState){
              return "#ced119";
            } else {
              var color = state_color_map[stateName];
              if (color){return color;} else {return "";}
            }
          })
        .attr("d", path)
        .on("click", function(d){
          d3.selectAll("#barChart").remove();
           var stateName = id_name_map[d.id];
           barChart(year, false, stateName);
          })
        .on("mousemove", function(d) {
            var html = "";
                html += "<div class=\"tooltip_kv\">";
                html += "<span class=\"tooltip_key\">";
                html += id_name_map[d.id] + ":";
                html += "</span>";
                html += "<span class=\"tooltip_value\">";
                html += (state_value_map[id_name_map[d.id]] ? state_value_map[id_name_map[d.id]] : "");
                html += "";
                html += "</span>";
                html += "</div>";

                $("#tooltip-container").html(html);
                $(this).attr("fill-opacity", "0.8");
                $("#tooltip-container").show();

                var coordinates = d3.mouse(this);
                var map_width = $('.states-choropleth')[0].getBoundingClientRect().width;

                if (d3.event.layerX < map_width / 2) {
                  d3.select("#tooltip-container")
                    .style("top", (d3.event.layerY + 15) + "px")
                    .style("left", (d3.event.layerX + 15) + "px");
                } else {
                  var tooltip_width = $("#tooltip-container").width();
                  d3.select("#tooltip-container")
                    .style("top", (d3.event.layerY + 15) + "px")
                    .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
                }
            })
            .on("mouseout", function() {
                $(this).attr("fill-opacity", "1.0");
                $("#tooltip-container").hide();
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
 document.getElementById("filter").addEventListener("click", filterGraph);
 document.getElementById("reset").addEventListener("click", resetGraph);

 function filterGraph(){
   filterFlag = true;
   d3.selectAll("#barChart").remove();
   barChart(yearNumber, filterFlag);
   updateGraph(yearNumber, filterFlag);
 }

 function resetGraph(){
   filterFlag = false;
   document.getElementById("inputBoxMax").value = null;
   document.getElementById('inputBoxMin').value = null;
   d3.selectAll("#barChart").remove();
   barChart(yearNumber, filterFlag);
   updateGraph(yearNumber, filterFlag);
 }

 document.getElementById("search").addEventListener("click", searchGraph);
 document.getElementById("back").addEventListener("click", backGraph);

 function searchGraph(){
   stateFlag = true;
   d3.selectAll("#barChart").remove();
   barChart(yearNumber);
   updateGraph(yearNumber, filterFlag);
 }

 function backGraph(){
   document.getElementById("inputBoxState").value = null;
   d3.selectAll("#barChart").remove();
   barChart(yearNumber);
   updateGraph(yearNumber, filterFlag);
 }

});
