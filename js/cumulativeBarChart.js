var margin = {top: 20, right: 20, bottom: 20, left: 120};

var width = 800 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

var cumulativesvg = d3.select("#cumulative").append("svg")
.attr("id", "cumulativeB")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var diseases = ["Alzheimer's disease","Cancer","CLRD","Diabetes","Heart disease","Influenza and pneumonia","Kidney disease","Stroke","Suicide","Unintentional injuries"]
var bar_height = 40;
var gap = 23;
var startX = 35;

var x = d3.scaleLinear()
.domain([0, 800000])
.range([0, width-startX])

var xAxis = d3.axisTop(x).scale(x);
var xAxisGroup = cumulativesvg.append("g")
                              .attr("transform", "translate(35,0)")
                              .call(xAxis);
var diseases_dict = {}
var num_dict = {}
var culBarChartColor = "#af0000";
for(var i = 0; i < diseases.length; i++){
  var svg = cumulativesvg
          .append("rect")
          .attr("x", startX)
          .attr("y", (bar_height + gap)*i+10)
          .attr("height", bar_height)
          .attr("fill", culBarChartColor);
  diseases_dict[diseases[i]] = svg;

  var numSvg = cumulativesvg
          .append("text")
          .attr("y", (bar_height + gap)*i+36)
          .style('font-size', '1.0em')
          .attr("font-family", "sans-serif")
          .attr("fill", "white");
  num_dict[diseases[i]] = numSvg;
}

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
    
var y = d3.scaleBand()
          .domain(diseases)
          .rangeRound([0, (bar_height + gap) * 10]);

var yAxis = d3.axisLeft(y)
var yAxisGroup = cumulativesvg.append("g")
.attr("transform", "translate(30,0)")
.attr("font-size","15px")
.call(yAxis);

var line = cumulativesvg.append("line")
.attr("x1", startX)
.attr("x2", startX)
.attr("y1", 0)
.attr("y2", (bar_height + gap * 2) * 8 - 30)
.attr("stroke-width", 1)
.attr("stroke", "white");

function cumulativeBarChart(year,states){

  var csvFile = "data/NCHS_-_Leading_Causes_of_Death__United_States.csv";
  d3.csv(csvFile, function (error, csv) {
    if(error){
      throw error;
    } else {
      var total1=0,total2=0,total3=0,total4=0,total5=0,total6=0,total7=0,total8=0,total9=0,total10 = 0;
      var data = [];
      var reason_value = [];
      var reason_value1 = {};
      var reason_value2 = {};
      var data1 = csv.filter(csv => csv.Year === year && csv.CauseName !== "All causes");
      data1.forEach(function(d){

        d.State = d.State;
        for(var i=0; i < states.length;i++){
          if(states[i] === d.State){
            d.CauseName = d.CauseName;
            if(d.CauseName === "Alzheimer's disease"){
              d.Deaths = parseFloat(d.Deaths);
              total1 = total1 + d.Deaths;
            }
            if(d.CauseName === "Cancer"){
              d.Deaths = parseFloat(d.Deaths);
              total2 = total2 + d.Deaths;
            }
            if(d.CauseName === "CLRD"){
              d.Deaths = parseFloat(d.Deaths);
              total3 = total3 + d.Deaths;
            }
            if(d.CauseName === "Diabetes"){
              d.Deaths = parseFloat(d.Deaths);
              total4 = total4 + d.Deaths;
            }
            if(d.CauseName === "Heart disease"){
              d.Deaths = parseFloat(d.Deaths);
              total5 = total5 + d.Deaths;
            }
            if(d.CauseName === "Influenza and pneumonia"){
              d.Deaths = parseFloat(d.Deaths);
              total6 = total6 + d.Deaths;
            }
            if(d.CauseName === "Kidney disease"){
              d.Deaths = parseFloat(d.Deaths);
              total7 = total7 + d.Deaths;
            }
            if(d.CauseName === "Stroke"){
              d.Deaths = parseFloat(d.Deaths);
              total8 = total8 + d.Deaths;
            }
            if(d.CauseName === "Suicide"){
              d.Deaths = parseFloat(d.Deaths);
              total9 = total9 + d.Deaths;
            }
            if(d.CauseName === "Unintentional injuries"){
              d.Deaths = parseFloat(d.Deaths);
              total10 = total10 + d.Deaths;
            }
          }
        }
      });

      reason_value["Alzheimer's disease"] = total1;
      reason_value["Cancer"] = total2;
      reason_value["CLRD"] = total3;
      reason_value["Diabetes"] = total4;
      reason_value["Heart disease"] = total5;
      reason_value["Influenza and pneumonia"] = total6;
      reason_value["Kidney disease"] = total7;
      reason_value["Stroke"] = total8;
      reason_value["Suicide"] = total9;
      reason_value["Unintentional injuries"] = total10;

      data.push(total1);
      data.push(total2);
      data.push(total3);
      data.push(total4);
      data.push(total5);
      data.push(total6);
      data.push(total7);
      data.push(total8);
      data.push(total9);
      data.push(total10);

      for(var i = 0; i < diseases.length; i++){
        diseases_dict[diseases[i]]
        .transition()
        .duration(750)
        .attr("width", function(d) { return x(reason_value[diseases[i]]);})

        num_dict[diseases[i]]
        .transition()
        .duration(750)
        .attr("x", function(d) { return startX + x(reason_value[diseases[i]]) + 10;})
        .text(reason_value[diseases[i]]);
      }
    }

  });
}
