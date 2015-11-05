// SETUP CANVAS
var canvas = d3.select("#vizArea")
	.append("svg")
		.attr("width", 1000)
		.attr("height", 700);

document.getElementById("vizArea").oncontextmenu = function() {
     return false;  
} 

// SETUP BORDER
var rect = canvas.append("rect")
  .attr("x",0)
  .attr("y", 0)
  .attr("width",1000)
  .attr("height", 700)
  .attr("fill", 'white')
  .attr("style", 'border: 5px solid red;');


// How to get stuff from database
HttpClient = function () {
  this.get = function (aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function () { 
      if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200){
        aCallback(anHttpRequest.responseText);
      }
    }
    anHttpRequest.open( "GET", aUrl, true );            
    anHttpRequest.send( null );
  }
  this.post = function (aUrl, params, aCallback) {
    var http = new XMLHttpRequest();
    http.open("POST", aUrl, true);
    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
          alert(http.responseText);
      }
    }
    http.send(params);
  }
}

// Draw Map
var projection = d3.geo.mercator();
var path = d3.geo.path().projection(projection);

var g = canvas.append("g");
g.attr("transform","translate(10,188)scale(1)");
g.selectAll("path")  
            .attr("d", path.projection(projection));

var tooltip = canvas.append("div")
    .attr("class", "tooltip");

// From Map File
queue()
    .defer(d3.json, "world-110m2.json")
    .defer(d3.tsv, "world-country-names.tsv")
    .await(ready);

// 
function ready(error, topology, names){
	var countries = topojson.object(topology, topology.objects.countries)
            .geometries;

    var aClient = new HttpClient();

    aClient.get("/results", function (response) {
      var array = JSON.parse(response);
      countries.forEach(function(d) { 
        d.name = names.filter(function(n) { return d.id == n.id; })[0].name;
        var country = array[d.name];
        if(country != undefined){
          d.three = country.l3;
          d.two = country.l2;
          d.one = country.l1;
          var total = d.three + d.two + d.one
          var successPercent = d.three/total;
          console.log("Total: "+successPercent+"%");

          if(successPercent > 0.80){
            d.stats = "rgb(0,255,0)";
          }
          else if(successPercent > 0.60){
            d.stats = "rgb(60,210,0)";
          }
          else if(successPercent > 0.40){
            d.stats = "rgb(110,150,0)";
          }
          else if(successPercent > 0.20){
            d.stats = "rgb(160,100,0)";
          }
          else{
            d.stats = "rgb(210,50,0)";
          }
          d.stroke = "white";
        }
        else{
          d.stats = "rgb(100,100,100)";
          d.stroke = "white";
        }        
      });

      
      var country = g.selectAll("path")
          .data(countries);

      country
          .enter()
              .append("path")
              .attr("stroke", function(d,i) { return d.stroke; })
              .attr("title", function(d,i) { return d.name; })
              .attr("d", path)
              .attr("fill", function(d,i) { return d.stats; })
              .attr("class","country");

      country
        .on("mousemove", function(d,i) {
          var mouse = d3.mouse(canvas.node()).map( function(d) { return parseInt(d); } );
          
          // Notify user with hovered thing
          $("#tipper").empty();
          $("#success").empty();
          $("#failure").empty();  

          // Get all pisa results
          if(d.three !== undefined
            && d.two !== undefined
            && d.one !== undefined){          
            var total = d.three + d.two + d.one;
            var success = Math.round((d.three/total)*100);
            var failure = Math.round(((d.two+d.one)/total)*100);
            $("#success").append("<b style='color:green;font-size: 250%;'>"+success+"%</b> of students surveyed <br> in <b>"+d.name+"</b><br> are academically <b>on track</b>, according to the ISCED standard");
            $("#failure").append("<b style='color:red;font-size: 250%;'>"+failure+"%</b> of students surveyed <br> in <b>"+d.name+"</b><br> are academically <b>behind</b>, according to the ISCED standard");
          }
          else{
            $("#tipper").append("<b>"+d.name+ "</b> was not surveyed by PISA 2012");
            d3.select("#success").text("");
            d3.select("#failure").text("");
          }

          tooltip
            .classed("hidden", false)
            .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
            .html(d.name)
        })
        .on("mouseout",  function(d,i) {
          tooltip.classed("hidden", true)
        })
        .on("click", function(d) { 
          $("#countrySelect").val(d.name);
            goToNextViz(d.name);
        });

    });
}

var pastScale = 1;
var initial = true;

// zoom and pan
var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        var coord = d3.event.translate;
        if(pastScale == d3.event.scale || initial){
          var x = coord[0] + 10;
          var y = coord[1] + 188;
          coord = [x,y];
          initial = false;
        }

        g.attr("transform","translate("+ 
            coord.join(",")+")scale("+d3.event.scale+")");
        g.selectAll("path")  
            .attr("d", path.projection(projection));     

  });
canvas.call(zoom)


function goToNextViz(name){
	window.location = "/details/"+name;
}