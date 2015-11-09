$( document ).ready(function(){

  var country = $("#countryName")[0].innerText;

  console.log(country)

  var canvas = d3.select("#vizButton")
  	.append("svg")
  		.attr("id","svg_area")
  		.attr("width", "100%")
  		.attr("height", "100%");
});

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

function pie(context){  
  var country = $("#countryName")[0].innerText;
  var vis = d3.select("#vizArea").selectAll("*").remove(); 
  var aClient = new HttpClient();

  aClient.get("/data?country='"+country+"'&context="+context, function (response) {
    
    var array = JSON.parse(response);
    
    var data1 = [];
    var data2 = [];

    var total1 = 0;
    var total2 = 0;

    if(context === "gender"){
      var data1 = [
        {"context":"Coed School - Passed","tally": array["cp"]},
        {"context":"Coed School - Failed","tally": array["cf"]}
        ];

      var data2 = [
        {"context":"Segregated School - Passed","tally": array["ncp"]},
        {"context":"Segregated School - Failed","tally": array["ncf"]}
        ];

        total1 = array["cp"]+array["cf"];
        total2 = array["ncp"]+array["ncf"];
    }
    else if(context === "type"){
      var data1 = [
        {"context":"Private School - Passed","tally": array["pPrivate"]},
        {"context":"Private School - Failed","tally": array["fPrivate"]}
        ];

      var data2 = [
        {"context":"Public School - Passed","tally": array["pPublic"]},
        {"context":"Public School - Failed","tally": array["fPublic"]}
        ];

        total1 = array["pPrivate"]+array["fPrivate"];
        total2 = array["pPublic"]+array["fPublic"];
    }
    else if(context === "sports"){
      var data1 = [
        {"context":"School has Sport Clubs - Passed","tally": array["sp"]},
        {"context":"School has Sport Clubs - Failed","tally": array["sf"]}
        ];

      var data2 = [
        {"context":"School doesn't have Sport Clubs - Passed","tally": array["nsp"]},
        {"context":"School doesn't have Sport Clubs - Failed","tally": array["nsf"]}
        ];

        total1 = array["sp"]+array["sf"];
        total2 = array["nsp"]+array["nsf"];
    }
    else if(context === "arts"){
      var data1 = [
        {"context":"School has Art Clubs - Passed","tally": array["ap"]},
        {"context":"School has Art Clubs - Failed","tally": array["af"]}
        ];

      var data2 = [
        {"context":"School doesn't have Art Clubs - Passed","tally": array["nap"]},
        {"context":"School doesn't have Art Clubs - Failed","tally": array["naf"]}
        ];

        total1 = array["ap"]+array["af"];
        total2 = array["nap"]+array["naf"];
    }
    

    //console.log(response);

    var width = 1200,
    height = 500,
    radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#00aa00", "#ff0000"]);

    var svg1 = d3.select("#vizArea").append("svg")
        .attr("width", width/2)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 4 + "," + height / 2 + ")");

    var svg2 = d3.select("#vizArea").append("svg")
      .attr("width", width/2)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 4 + "," + height / 2 + ")");

    var pie = d3.layout.pie()
      .sort(null)
      .startAngle(0*Math.PI)
      .endAngle(2*Math.PI)
      .value(function (d) {
        return d.tally;
      });

    // var svg = d3.select("#vizArea").append("div")
    //   .attr("width", width)
    //   .attr("height", height)
    //   .append("g")
    //   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // FIRST GRAPH

    var arc = d3.svg.arc()
        .outerRadius(radius - 50)
        .innerRadius(radius - 100);

    var g = svg1.selectAll(".arc")
      .data(pie(data1))
      .enter().append("g")
      .attr("class", "arc")
      .on("mouseover", function (d) {
        d3.select("#tooltip")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .style("opacity", 1)
          .select("#value")
          .text(Math.round((d.value/total1)*100));
        d3.select("#tooltip")
          .select("#importantLabel")
          .text(d.data.context)
        })
      .on("mouseout", function () {
        // Hide the tooltip
        d3.select("#tooltip")
          .style("opacity", 0)
        });

        g.append("path")
            .style("fill", function (d) {
              return color(d.data.context);
            })
            .style('stroke', 'white')
            .style('stroke-width', 10)
            .transition().delay(function(d, i) { return i * 1000; }).duration(1000)
            .attrTween('d', function(d) {
                var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                return function(t) {
                    d.endAngle = i(t);
                  return arc(d);
                }
              });

        // Labels
        g.append("text")
          .attr("transform", function (d) {
          return "translate(" + arc.centroid(d) + ")";
          })
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .text(function (d) {
          return d.data.tally;
        });

    // SECOND GRAPH

    var arc2 = d3.svg.arc()
      .outerRadius(radius - 50)
      .innerRadius(radius - 100);

    var g2 = svg2.selectAll(".arc")
      .data(pie(data2))
      .enter().append("g")
      .attr("class", "arc")
      .on("mouseover", function (d) {
        d3.select("#tooltip")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .style("opacity", 1)
          .select("#value")
          .text(Math.round((d.value/total2)*100));
        d3.select("#tooltip")
          .select("#importantLabel")
          .text(d.data.context)
      })
      .on("mouseout", function () {
        // Hide the tooltip
        d3.select("#tooltip")
          .style("opacity", 0)
        });

        g2.append("path")
            .style("fill", function (d) {
              return color(d.data.context);
            })
            .style('stroke', 'white')
            .style('stroke-width', 10)
            .transition().delay(function(d, i) { return i * 1000; }).duration(1000)
            .attrTween('d', function(d) {
                var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                return function(t) {
                    d.endAngle = i(t);
                  return arc(d);
                }
              });

        // Labels
        g2.append("text")
          .attr("transform", function (d) {
          return "translate(" + arc.centroid(d) + ")";
          })
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .text(function (d) {
          return d.data.tally;
        });

        // END
  });  
}

function bar(){
  var country = $("#countryName")[0].innerText;
  var vis = d3.select("#vizArea").selectAll("*").remove(); 
  var aClient = new HttpClient();

  aClient.get("/data?country='"+country+"'&context=location", function (response) {
    
    var array = JSON.parse(response);


  });
}