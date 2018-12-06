function donutCompare(year, state){
  margin = {top: 80, right: 50, bottom: 100, left: 200};

  var width = 400,
      height = 400,
      outerRadius = Math.min(width, height) / 2,
      innerRadius = 0.51 * outerRadius;

  var drawSvg = d3.select("#donutchartCompare").append("svg")
  .attr("id", "donutCompareC")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")");

  d3.csv('data/NCHS_-_Leading_Causes_of_Death__United_States.csv', function(error, data) {
    var data = data.filter(data => data.Year === year && data.State === state && data.CauseName !== "All causes");
    var total = 0;
    data.forEach(function(d) {
      d.CauseName = d.CauseName;
      d.Deaths = +d.Deaths;
      d.width = +1;
      total += +d.Deaths;
    });

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.width; });

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([0, 0])
      .html(function(d) {
        return d.data.CauseName + ": <span style='color:#6CC4A4'>" + d.data.Deaths + "</span>";
      });

    var arc = d3.arc()
      .innerRadius(innerRadius);

    var outlineArc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

    var range = ["#ffd8d8", "#910000"];
    var domain = d3.extent(data, function(d){
      return d.Deaths;
    });
    var colorScale = d3.scaleLinear()
    .domain(domain)
    .range(range);

    drawSvg.call(tip);

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
        .attr("fill", function(d){ return colorScale(d.data.Deaths); })
        .attr("class", "solidArc")
        .attr("stroke", "#FFFAFA")
        .attr("d", arc)
        .attr("opacity", 0.9)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    var outerPath = drawSvg.selectAll(".outlineArc")
        .data(pie(data))
      .enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "#FFFAFA")
        .attr("class", "outlineArc")
        .attr("d", outlineArc);

    var score = total;

    drawSvg.append("svg:text")
      .attr("class", "aster-score")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("stroke", "#FFFAFA")
      .text(Math.round(score));

  });
}
