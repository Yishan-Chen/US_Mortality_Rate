function addText(year, state){
  var textWidth = 1000,
      textHeight = 80;

  var textAddSvg = d3.select("#textCompare").append("svg")
  .attr("id", "text2")
  .attr("width", textWidth)
  .attr("height", textHeight)
  .append("g")
  .attr("transform", "translate(" + (textWidth/2) + "," + (textHeight/2) + ")");

  textAddSvg.append("text")
  .attr("stroke", "#FFFAFA")
  .attr("font-size", 50)
  .text(year+": "+state);
}
