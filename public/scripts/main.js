

var canvas = d3.select("#vizArea")
	.append("svg")
		.attr("width", 600)
		.attr("height", 500);

var circle = canvas.append("circle")
	.attr("cx",250)
	.attr("cy", 300)
	.attr("r", 50)
	.attr("fill", "red");

