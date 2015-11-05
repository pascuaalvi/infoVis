$( document ).ready(function(){
	var country = $("#countryName")[0].innerText;

  console.log(country)

  var canvas = d3.select("#vizButton")
  	.append("svg")
  		.attr("id","svg_area")
  		.attr("width", "100%")
  		.attr("height", "100%");

  var canvas = d3.select("#vizArea")
  	.append("svg")
  		.attr("id","svg_area")
  		.attr("width", "100%")
  		.attr("height", "100%");

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

  // Build buttons


  function boysXgirls(){	
  	var vis = d3.select("#svg_area"); var arc = d3.svg.arc() .innerRadius(50) .outerRadius(100) .startAngle() .endAngle(-0.15*Math.PI);
  	vis.append("path") .attr("d", arc) .attr("transform", "translate(300,200)");
  }

});