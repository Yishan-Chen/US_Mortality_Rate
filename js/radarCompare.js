function RadarCompare1(year, state) {
	var cfg = {
	 w: 400,
	 h: 400,
	 margin: {top: 80, right: 50, bottom: 100, left: 200},
	 levels: 5,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: true,	//If true the area and stroke will follow a round path (cardinal-closed)
	 //color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
	 color: d3.scaleOrdinal().range(["red"])
	};

  var csvFile = "data/NCHS_-_Leading_Causes_of_Death__United_States.csv";
  d3.csv(csvFile, function (error, csv) {
    if(error){
      throw error;
    } else {
      var data = [];
      var data1 = csv.filter(csv => csv.Year === year && csv.CauseName !== "All causes" && csv.State === state)
      var total1 = 0;
      data1.forEach(function(d){
        d.Year = d.Year;
        d.Deaths = +d.Deaths;
        total1 += +d.Deaths;
      })
      data1.forEach(function(d){
        d.percentage = +d.Deaths/total1;
      })
      data.push(data1)

      var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.percentage;}))}));

      var allAxis = (data[0].map(function(i, j){return i.CauseName})),	//Names of each axis
        total = allAxis.length,					//The number of different axes
        radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
        Format = d3.format('%'),			 	//Percentage formatting
        angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

      var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

      var radarchartsvg = d3.select("#radarchartCompare1").append("svg")
      .attr("id", "radarCompareC1")
      .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom);
      var g = radarchartsvg.append("g")
      .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

      var filter = g.append('defs').append('filter').attr('id','glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

      //Wrapper for the grid & axes
      var axisGrid = g.append("g").attr("class", "axisWrapper");

      //Draw the background circles
      axisGrid.selectAll(".levels")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function(d, i){return radius/cfg.levels*d;})
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter" , "url(#glow)");

      //Text indicating at what % each level is
      axisGrid.selectAll(".axisLabel")
         .data(d3.range(1,(cfg.levels+1)).reverse())
         .enter().append("text")
         .attr("class", "axisLabel")
         .attr("x", 4)
         .attr("y", function(d){return -d*radius/cfg.levels;})
         .attr("dy", "0.4em")
         .style("font-size", "10px")
         .attr("fill", "#737373")
         .attr("stroke", "#FFFAFA")
         .text(function(d,i) { return parseInt(Format(maxValue * d/cfg.levels)) + "%"; });

      //Create the straight lines radiating outward from the center
      var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
      //Append the lines
      axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

      //Append the labels at each axis
      axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("stroke", "#FFFAFA")
        .attr("dy", "0.35em")
        .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
        .text(function(d){return d})
        .call(wrap, cfg.wrapWidth);

      var radarLine = d3.radialLine()
        .curve(d3.curveBasisClosed)
        .radius(function(d) { return rScale(d.percentage); })
        .angle(function(d,i) {	return i*angleSlice; });

      if(cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
      }

      //Create a wrapper for the blobs
      var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

      //Append the backgrounds
      blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("fill", function(d,i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d,i){
          d3.selectAll(".radarArea")
            .transition().duration(200)
            .style("fill-opacity", 0.1);
          d3.select(this)
            .transition().duration(200)
            .style("fill-opacity", 0.7);
        })
        .on('mouseout', function(){
          d3.selectAll(".radarArea")
            .transition().duration(200)
            .style("fill-opacity", cfg.opacityArea);
        });

      blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d,i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter" , "url(#glow)");

      blobWrapper.selectAll(".radarCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function(d,i){ return rScale(d.percentage) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.percentage) * Math.sin(angleSlice*i - Math.PI/2); })
        //.style("fill", function(d,i,j) { return color(j); })
        .style("fill", "#FFFAFA")
        .style("fill-opacity", 0.8);

      var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

      //Append a set of invisible circles on top for the mouseover pop-up
      blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius*1.5)
        .attr("cx", function(d,i){ return rScale(d.percentage) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.percentage) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d,i) {
          newX =  parseFloat(d3.select(this).attr('cx')) - 10;
          newY =  parseFloat(d3.select(this).attr('cy')) - 10;
          tooltip
            .attr('x', newX)
            .attr('y', newY)
            .attr("stroke", "#FFFAFA")
            .text(Format(d.percentage))
            .transition().duration(200)
            .style('opacity', 1);
        })
        .on("mouseout", function(){
          tooltip.transition().duration(200)
            .style("opacity", 0);
        });

      var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);

      function wrap(text, width) {
        text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.4,
          y = text.attr("y"),
          x = text.attr("x"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
        });
      }

    }
  });

}

function RadarCompare2(year, state) {
	var cfg = {
	 w: 400,
	 h: 400,
	 margin: {top: 80, right: 50, bottom: 100, left: 200},
	 levels: 5,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: true,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
	};

  var csvFile = "data/NCHS_-_Leading_Causes_of_Death__United_States.csv";
  d3.csv(csvFile, function (error, csv) {
    if(error){
      throw error;
    } else {
      var data = [];
      var data1 = csv.filter(csv => csv.Year === year && csv.CauseName !== "All causes" && csv.State === state)
      var total1 = 0;
      data1.forEach(function(d){
        d.Year = d.Year;
        d.Deaths = +d.Deaths;
        total1 += +d.Deaths;
      })
      data1.forEach(function(d){
        d.percentage = +d.Deaths/total1;
      })
      data.push(data1)

      var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.percentage;}))}));

      var allAxis = (data[0].map(function(i, j){return i.CauseName})),	//Names of each axis
        total = allAxis.length,					//The number of different axes
        radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
        Format = d3.format('%'),			 	//Percentage formatting
        angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

      var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

      var radarchartsvg = d3.select("#radarchartCompare2").append("svg")
      .attr("id", "radarCompareC2")
      .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom);
      var g = radarchartsvg.append("g")
      .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

      var filter = g.append('defs').append('filter').attr('id','glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

      //Wrapper for the grid & axes
      var axisGrid = g.append("g").attr("class", "axisWrapper");

      //Draw the background circles
      axisGrid.selectAll(".levels")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function(d, i){return radius/cfg.levels*d;})
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter" , "url(#glow)");

      //Text indicating at what % each level is
      axisGrid.selectAll(".axisLabel")
         .data(d3.range(1,(cfg.levels+1)).reverse())
         .enter().append("text")
         .attr("class", "axisLabel")
         .attr("x", 4)
         .attr("y", function(d){return -d*radius/cfg.levels;})
         .attr("dy", "0.4em")
         .style("font-size", "10px")
         .attr("fill", "#737373")
         .attr("stroke", "#FFFAFA")
         .text(function(d,i) { return parseInt(Format(maxValue * d/cfg.levels)) + "%"; });

      //Create the straight lines radiating outward from the center
      var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
      //Append the lines
      axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

      //Append the labels at each axis
      axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("stroke", "#FFFAFA")
        .attr("dy", "0.35em")
        .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
        .text(function(d){return d})
        .call(wrap, cfg.wrapWidth);

      var radarLine = d3.radialLine()
        .curve(d3.curveBasisClosed)
        .radius(function(d) { return rScale(d.percentage); })
        .angle(function(d,i) {	return i*angleSlice; });

      if(cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
      }

      //Create a wrapper for the blobs
      var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

      //Append the backgrounds
      blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("fill", function(d,i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d,i){
          d3.selectAll(".radarArea")
            .transition().duration(200)
            .style("fill-opacity", 0.1);
          d3.select(this)
            .transition().duration(200)
            .style("fill-opacity", 0.7);
        })
        .on('mouseout', function(){
          d3.selectAll(".radarArea")
            .transition().duration(200)
            .style("fill-opacity", cfg.opacityArea);
        });

      blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d,i) { return cfg.color(i); })
				//.style("stroke", "steelblue")
        .style("fill", "none")
        .style("filter" , "url(#glow)");

      blobWrapper.selectAll(".radarCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function(d,i){ return rScale(d.percentage) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.percentage) * Math.sin(angleSlice*i - Math.PI/2); })
        //.style("fill", function(d,i,j) { return color(j); })
        .style("fill", "#FFFAFA")
        .style("fill-opacity", 0.8);

      var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

      //Append a set of invisible circles on top for the mouseover pop-up
      blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius*1.5)
        .attr("cx", function(d,i){ return rScale(d.percentage) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.percentage) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d,i) {
          newX =  parseFloat(d3.select(this).attr('cx')) - 10;
          newY =  parseFloat(d3.select(this).attr('cy')) - 10;
          tooltip
            .attr('x', newX)
            .attr('y', newY)
            .attr("stroke", "#FFFAFA")
            .text(Format(d.percentage))
            .transition().duration(200)
            .style('opacity', 1);
        })
        .on("mouseout", function(){
          tooltip.transition().duration(200)
            .style("opacity", 0);
        });

      var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);

      function wrap(text, width) {
        text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.4,
          y = text.attr("y"),
          x = text.attr("x"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
        });
      }

    }
  });

}
