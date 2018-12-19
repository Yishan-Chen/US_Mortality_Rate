var margin = {top: 0, right: 20, bottom: 20, left: 20};

var width = 380 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var selectsvg = d3.select("#select").append("svg")
.attr("id", "selectB")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(150,150)");

var cornerRadius = 3;
var padAngle = 0.015;
var floatFormat = d3.format('.4r');
var percentFormat = d3.format(',.2%');

var colorScale = d3.scaleOrdinal()
.range(["#770000", "#696969"]);

var radius = Math.max(width, height) / 2;

var pie = d3.pie();

var arc = d3.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.5)
            .cornerRadius(cornerRadius)
            .padAngle(padAngle);

var outerArc = d3.arc()
                  .outerRadius(radius * 0.9)
                  .innerRadius(radius * 0.9);
var slice = selectsvg
      .selectAll('path');

selectsvg.append('text')
          .attr('class', 'toolCircle')
          .attr('dy', -25)
          .attr('dx', -8)
          .text("Total")
          .style('font-size', '1.1em')
          .style('text-anchor', 'middle')
          .style("stroke", "white")
          .style("fill", "white")

var pieText = selectsvg.append('text')
                      .attr('class', 'toolCircle')
                      .attr('dy', 10)
                      .style('font-size', '2.0em')
                      .style('text-anchor', 'middle')
                      .style("stroke", "white")
                      .style("fill", "white")

function selectPieChart(year,states){
  var csvFile = "data/NCHS_-_Leading_Causes_of_Death__United_States.csv";
  d3.csv(csvFile, function (error, csv) {
    if(error){
      throw error;
    } else {
      var total = 0;
      var cumulative = 0;
      var data = [];
      var data1 = csv.filter(csv => csv.Year === year && csv.CauseName === "All causes");
      data1.forEach(function(d){
        for(var i=0; i<states.length;i++){
          if(states[i] === d.State){
            d.Deaths = parseFloat(d.Deaths);
            cumulative = cumulative + d.Deaths;
          }
        }
        if(d.State === "United States") {
          d.Deaths = parseFloat(d.Deaths);
          total = d.Deaths;
        }
      });
      var rest = total - cumulative;
      data.push(cumulative);
      data.push(rest);

      slice.data(pie(data))
            .enter()
            .append('path')
            .style("fill", function(d) { 
                if(cumulative !== 0){
                  return colorScale(d.data);
                }
                else{
                  return "#5e605f";
                }
             })
            .attr('d', arc);

      
      pieText.text(function(d){
        return percentFormat(floatFormat(data[0]/total));
      });
    }
  });

}
