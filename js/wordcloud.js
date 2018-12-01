wordCloud("1999");
function wordCloud(year){
  var csvFile = "data/NCHS_-_Leading_Causes_of_Death__United_States.csv";
  var valueCount = {}
  d3.csv(csvFile, function (error, csv) {
    if(error){
      throw error;
    } else {
      var data = csv.filter(csv => csv.Year === year && csv.State !== "United States" && csv.CauseName === "All causes");
      data.forEach(function(d){
        valueCount[d.State] = +d["Deaths"];
      });
      console.log(valueCount)

      var width = 800;
      var height = 500;

      var word_entries = d3.entries(valueCount);

      var maxDeath = d3.max(data, d => d.value)
      var minDeath = d3.min(data, d => d.value)

      var xScale = d3.scaleLinear()
      .domain([d3.min(word_entries, function(d) {return d.value;}), d3.max(word_entries, function(d) {return d.value;})])
      .range([10,100]);

      var range = ["#ffd8d8","#910000"];
      var domain = [d3.min(word_entries, function(d) {return d.value;}), d3.max(word_entries, function(d) {return d.value;})]
      color = d3.scaleLinear().domain(domain).range(range);


      var layout = d3.layout.cloud()
      .size([width, height])
      .timeInterval(20)
      .words(word_entries)
      .fontSize(function(d) { return xScale(+d.value); })
      .text(function(d) { return d.key; })
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .on("end", draw)
      .start();

      function draw(words) {
        console.log(words)
        d3.select("#wordcloud")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return xScale(d.value) + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d) {return color(d.value);})
        //.style("fill", "red")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.key; });
      }

    }
    //d3.layout.cloud().stop();
  });
}
