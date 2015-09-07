console.log("Using... first viz");

// clear stuff d3.select("#divForViz")

var canvas = d3.select("#divForViz")
						.append("svg")
						.attr("width", "100%")
						.attr("height", 550);

// var circle = canvas.append("circle")
// 					.attr("cx",200)
// 					.attr("cy",200)
// 					.attr("r", 20)
// 					.attr("fill", "red");


/*
var width  = 960,
    height = 550;

var color = d3.scale.category10();

var projection = d3.geo.mercator()
                .translate([480, 300])
                .scale(970);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var tooltip = d3.select("#map").append("div")
    .attr("class", "tooltip");

queue()
    .defer(d3.json, "world-110m2.json")
    .defer(d3.tsv, "world-country-names.tsv")
    .await(ready);

function ready(error, world, names) {

	console.log("ready")
;
  var countries = topojson.object(world, world.objects.countries).geometries,
      neighbors = topojson.neighbors(world, countries),
      i = -1,
      n = countries.length;

  countries.forEach(function(d) { 
    d.name = names.filter(function(n) { return d.id == n.id; })[0].name; 
  });

var country = svg.selectAll(".country").data(countries);

  country
   .enter()
    .insert("path")
    .attr("class", "country")    
      .attr("title", function(d,i) { return d.name; })
      .attr("d", path)
      .style("fill", function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); });

    //Show/hide tooltip
    country
      .on("mousemove", function(d,i) {
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

        tooltip
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
          .html(d.name)
      })
      .on("mouseout",  function(d,i) {
        tooltip.classed("hidden", true)
      });

}
*/



var projection = d3.geo.mercator();

var path = d3.geo.path()
          .projection(projection);

var g = canvas.append("g");

var tooltip = d3.select("#divForViz").append("div")
    .attr("class", "tooltip");


queue()
    .defer(d3.json, "world-110m2.json")
    .defer(d3.tsv, "world-country-names.tsv")
    .await(ready);


function ready(error, topology, names){

	var countries = topojson.object(topology, topology.objects.countries)
            .geometries;

    countries.forEach(function(d) { 
    	d.name = names.filter(function(n) { return d.id == n.id; })[0].name; 
  	});

    
    var country = g.selectAll("path")
        .data(countries);

    country
        .enter()
            .append("path")
            .attr("title", function(d,i) { return d.name; })
            .attr("d", path)
            .attr("fill", "rgb(100,100,100)")
            .attr("class","country");

    country
      .on("mousemove", function(d,i) {
        var mouse = d3.mouse(canvas.node()).map( function(d) { return parseInt(d); } );

        d3.select("#tipper").text(d.name);

        tooltip
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
          .html(d.name)
      })
      .on("mouseout",  function(d,i) {
        tooltip.classed("hidden", true)
      })
      .on("click", function(d) { 
      		goToNextViz(d.name);
  		});


}
      
   
// zoom and pan
var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        g.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        g.selectAll("path")  
            .attr("d", path.projection(projection)); 
  });
canvas.call(zoom)


function goToNextViz(name){
	window.location = "/secondViz?country="+name;
}