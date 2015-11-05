var canvas = d3.select("#vizArea")
	.append("svg")
		.attr("width", 1000)
		.attr("height", 700);

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