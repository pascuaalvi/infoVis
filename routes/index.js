var express = require('express');
var router = express.Router();

/* GET home page. */
console.log("Loading Index");

var d3 = require("d3");
var $ = require("jquery");

// Note: ISCED level 3 typically begins between ages 14 to 16
// Source: http://www.uis.unesco.org/Education/Documents/isced-2011-en.pdf
//    - Page 38, Section A. Principal Characteristics

// Routes
router.get('/', function (req, res) {
  res.render('index');      
});

router.get('/results', function (req, res) {
  var db = req.db;
  var countryArray = {};
  var query = "SELECT * FROM studentParse";

  db.serialize(function() {
    db.each(query, function(err, row) {
      countryArray[row.Country] = {l3: row.LevelThree, l2: row.LevelTwo, l1: row.LevelOne};
      //console.log(row.Country + " " + row.LevelThree + " "+ row.LevelTwo + " "+ row.LevelOne);
      before = row.id;
    }, function(){
      res.send(countryArray);
      res.end();
    });    
  });      
});

router.get('/data', function (req, res) {
  // Name of country to extract
  var country = ""+req.query.country;
  // Either: arts, sports, gender, location, type 
  var context = ""+req.query.context;

  if(country != "" && context != ""){
    var db = req.db;
    var countrydata = {};
    var query = "SELECT * FROM "+context+"Parse where Country = "+country;
    console.log(query)

    db.serialize(function() {

      db.each(query, function(err, row) {

        if(context === "gender"){
          countrydata = {cp: row.CoedPassed, cf: row.CoedFailed, ncp: row.NotCoedPassed, ncf: row.NotCoedFailed};
        }
        else if(context === "sports"){
          countrydata = {sp: row.SportsPassed, sf: row.SportsFailed, nsp: row.NoSportsPassed, nsf: row.NoSportsFailed};
        }
        else if(context === "arts"){
          countrydata = {ap: row.ArtsPassed, af: row.ArtsFailed, nap: row.NoArtsPassed, naf: row.NoArtsFailed};
        }
        else if(context === "type"){
          countrydata = {pPublic: row.PublicPassed, fPublic: row.PublicFailed, pPrivate: row.PrivatePassed, fPrivate: row.PrivateFailed};
        }
        else if(context === "location"){
          countrydata = {
            stp: row.SmallTownPassed, 
            stf: row.SmallTownFailed, 
            cp: row.CityPassed, 
            cf: row.CityFailed,
            vp: row.VillagePassed, 
            vf: row.VillageFailed,           
            tp: row.TownPassed, 
            tf: row.TownFailed, 
            lcp: row.LargeCityPassed, 
            lcf: row.LargeCityFailed
          };
        }

      }, function(){
        res.send(countrydata);
        res.end();
      });    

    });  
  }    

});

router.get('/details/:country', function (req, res) {
  var country = ""+req.params.country;
  if(country != ""){
    res.render('details', {
        title: 'PISA Data: '+country,
        countrySelected: country
      });
  }   
});

module.exports = router;
