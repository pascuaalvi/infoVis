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

function gender(){  
  var country = $("#countryName")[0].innerText;
  var vis = d3.select("#vizArea").selectAll("*").remove(); 
  var aClient = new HttpClient();

  var width = 800,
    height = 250,
    radius = Math.min(width, height) / 2;

  aClient.get("/data?country='"+country+"'&context=gender", function (response) {
    
    var array = JSON.parse(response);

    var total = response.cp + response.cf + response.ncp + response.ncf;
    
    var cp = array["cp"];
    var cf = array["cf"];
    var ncp = array["ncp"];
    var ncf = array["ncf"];

    var data = [
    {"context":"Coed School - Passed","tally":  cp},
    {"context":"Coed School - Failed","tally": cf},
    {"context":"Segregated School - Passed","tally": ncp},
    {"context":"Segregated School - Failed","tally": ncf}
    ];

    console.log(response);

    var width = 800,
    height = 250,
    radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#00aa00", "#55aa00", "#aa5500", "#aa0000"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 50)
        .innerRadius(radius - 70);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
        return d.tally;
    });

    var svg = d3.select("#vizArea").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
            return color(d.data.context);
        });

        g.append("text")
            .attr("transform", function (d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(function (d) {
                return d.data.context;
            });
    });  
}