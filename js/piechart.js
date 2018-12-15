//pieChart("2003");
/*
function pieChart(year){
  var margin = {top: 20, right: 170, bottom: 20, left: 170};

  var width = 800 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

  var piesvg = d3.select("#piechart").append("svg")
  .attr("id", "pieChart")
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

      var path = piesvg.select('.slices')
      .datum(data)
      .selectAll('path')
      .data(pie)
      .enter().append('path')
      .attr('fill', function(d) { return colorScale(d.data.CauseName); })
      .attr('d', arc);

      var label = piesvg.select('.labelName').selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('dy', '.35em')
      .html(function(d) {
          return d.data.CauseName + ':<tspan>' + percentFormat(floatFormat(d.data.Deaths/total)) + '</tspan>';
      })
      .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
       })
        .style('text-anchor', function(d) {
         return (midAngle(d)) < Math.PI ? 'start' : 'end';
       });

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

      d3.selectAll('.labelName text, .slices path').call(toolTip);


      function toolTip(selection) {
          selection.on('mouseenter', function (data) {
              piesvg.append('text')
                  .attr('class', 'toolCircle')
                  .attr('dy', -15)
                  .html(toolTipHTML(data))
                  .style('font-size', '.9em')
                  .style('text-anchor', 'middle');

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
            console.log(key)
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
*/
