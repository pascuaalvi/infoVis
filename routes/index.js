var express = require('express');
var router = express.Router();

/* GET home page. */
console.log("Loading Index");

var d3 = require("d3");

// Note: ISCED level 3 typically begins between ages 14 to 16
// Source: http://www.uis.unesco.org/Education/Documents/isced-2011-en.pdf
//    - Page 38, Section A. Principal Characteristics

// Routes
router.get('/', function (req, res) {
  var db = req.db;
  var fileArray = [];

  db.serialize(function() {
    var query = "SELECT * from school";
    db.each(query, function(err, row) {
      fileArray.push({ schoolid:row.SchoolID, age:row.Age, country: row.Country, iscedl: row.ISCEDL });
      before = row.id;
    }, function(){
      // After thing is done
      //console.log(fileArray);
      res.render('index', {
        data: fileArray
      });
    });    
  });
    
});

// Get the files
router.get('/code', function (req, res) {
  // Filename of file to get states of
  var fileName = req.query.fileName;
  console.log(fileName);
	var db = req.db;
	var fileArray = [];
  var query = "";

  if(fileName){
    query = 'SELECT uID AS id, created, filecontent '
      +'FROM filestates '
      +'WHERE fileID = '
      +'(SELECT fileID FROM files WHERE fileName="'+fileName+'")';
  }
  else{
    query = 'SELECT uID AS id, created, filecontent '
      +'FROM filestates ';
  }
  console.log("QUERY: "+query)

	db.serialize(function() {
    var before = null;
    db.each(query, function(err, row) {
    	//fileArray[count] = ({id: row.id, info: row.info});
      var d = new Date(row.created*1000).toString();
    	fileArray.push({ id:row.id, created:d, content:row.filecontent, previous: before});
      console.log(row.id + ': ' + row.filecontent + " CREATED: "+d+" BEFORE: "+before);
      before = row.id;
    }, function(){
      //addClickEvent(db, "visualize button");
      res.render('viz', {
        fileToViz: fileName,
        title: 'Graceful Code History',
        files: fileArray
      });
      res.end();
    });		 
	});
});


module.exports = router;
