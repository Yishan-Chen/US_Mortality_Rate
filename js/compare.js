function compareChart(){
  d3.select("#donutCompareC1").remove();
  d3.select("#radarCompareC1").remove();
  d3.select("#donutCompareC2").remove();
  d3.select("#radarCompareC2").remove();
  d3.select("#barChartC").remove();
  d3.selectAll(".text").style("visibility","visible");
  var whichYear1 = d3.select("#year-select-1").property("value");
  var whichState1 = d3.select("#state-select-1").property("value");
  var whichYear2 = d3.select("#year-select-2").property("value");
  var whichState2 = d3.select("#state-select-2").property("value");
  donutCompare1(whichYear1, whichState1);
  RadarCompare1(whichYear1, whichState1);
  donutCompare2(whichYear2, whichState2);
  RadarCompare2(whichYear2, whichState2);
  compareBarChart(whichYear1, whichYear2, whichState1, whichState2);
}

document.getElementById("comparebutton").addEventListener("click", compareChart);
