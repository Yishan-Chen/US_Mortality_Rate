var width = 600,
    height = 600,
    outerRadius = Math.min(width, height) / 2,
    innerRadius = 0.51 * outerRadius;

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.width; });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return d.data.CauseName + ": <span style='color:orangered'>" + d.data.Deaths + "</span>";
  });

var arc = d3.arc()
  .innerRadius(innerRadius);

var outlineArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

var drawSvg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var state = "Alabama";
var year = "2016";
var color = ['#9E0041','#E1514B','#F47245','#FB9F59','#FAE38C','#EAF195','#6CC4A4','#4D9DB4','#4776B4','#5E4EA1'];
var causes = ['Cancer', "Alzheimer's disease","Unintentional injuries", "CLRD", "Diabetes", "Heart disease", "Influenza and pneumonia", "Kidney disease", "Stroke", "Suicide",];
var cause_color_map = {}
for(var i =0; i < 10; i++){
  cause_color_map[causes[i]] = color[i];
};

drawSvg.call(tip);

function updateChart(year, state){
  drawSvg.selectAll("*").remove();
  d3.csv('data/NCHS_-_Leading_Causes_of_Death__United_States.csv', function(error, data) {
    var data = data.filter(data => data.Year === year && data.State == state && data.CauseName !== "All causes");

    console.log(data);
    var total = 0;
    data.forEach(function(d) {
      d.CauseName = d.CauseName;
      d.Deaths = +d.Deaths;
      d.width = +1;
      total += +d.Deaths;
    });

    arc.outerRadius(function (d) {
      var radius = (outerRadius - innerRadius) * (d.data.Deaths / total) * 2.5+ innerRadius;
      if (radius < (innerRadius+outerRadius)/2){
          return radius + 50;
      }
      else
        return radius;
    });

    var path = drawSvg.selectAll(".solidArc")
        .data(pie(data))
      .enter().append("path")
        .attr("fill", function(d) {
          return cause_color_map[d.data.CauseName]; })
        .attr("class", "solidArc")
        .attr("stroke", "gray")
        .attr("d", arc)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    var outerPath = drawSvg.selectAll(".outlineArc")
        .data(pie(data))
      .enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("class", "outlineArc")
        .attr("d", outlineArc);


    var score = total;

    drawSvg.append("svg:text")
      .attr("class", "aster-score")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle") // text-align: right
      .text(Math.round(score));

  });
}
