
/* MAIN SETUP */
express = require("express");

app = express();

fs = require("fs");
file = "pisaDB.db";
exists = fs.existsSync(file);
sqlite3 = require("sqlite3").verbose();

if (exists) {
  console.log("Loading Database from file: %s", file);
  db = new sqlite3.Database(file);
  app.set("db", db);
} else {
  console.log("DB not found!");
}

var countries = [];

db.serialize(function() {

  db.each("SELECT distinct Country from students", function(err, row) {
    countries[row.Country] = {
        "SportsPassed" : 0,
        "SportsFailed" : 0,
        "NoSportsPassed" : 0,
        "NoSportsFailed" : 0,
        "ArtsPassed" : 0,
        "ArtsFailed" : 0,
        "NoArtsPassed" : 0,
        "NoArtsFailed" : 0,
        "NoSportsFailed" : 0,
        "NoSportsPassed" : 0,
        "PrivatePassed" : 0,
        "PrivateFailed" : 0,
        "PublicPassed" : 0,
        "PublicFailed" : 0,
        "CoedPassed" : 0,
        "CoedFailed" : 0,
        "NotCoedPassed" : 0,
        "NotCoedFailed" : 0,
        "SmallTownPassed" : 0,
        "SmallTownFailed" : 0,
        "CityPassed" : 0,
        "CityFailed" : 0,
        "VillagePassed" : 0,
        "VillageFailed": 0,
        "TownPassed" : 0,
        "TownFailed" : 0,
        "LargeCityPassed" : 0,
        "LargeCityFailed" : 0,        
        };
      }, function(){
        // countries["Vietnam"]["SmallTownPassed"] += 1
        //console.log(countries);
       
        db.each("select country, iscedl, schoolType, schoolLocation, arts, sports, girls, boys from school2012 inner join students on school2012.SCHOOLID = students.SchoolID and school2012.CNT = students.Country", 
          function(err, row) {
          var invalid = false;
          var passed = false;
          if(row.ISCEDL === "ISCED level 3"){
            passed = true;
            //db.run("UPDATE detailParse SET LevelThree = LevelThree + 1 WHERE Country = '"+row.Country+"'");
          }
          else if(row.ISCEDL === "ISCED level 2" || row.ISCEDL === "ISCED level 1"){
            passed = false;
            //db.run("UPDATE detailParse SET LevelTwo = LevelTwo + 1 WHERE Country = '"+row.Country+"'");
          }
          else{
            invalid = true;
          }
          
          if(!invalid){
              
            // Location
            if(row.SchoolLocation === "Small Town"){
              if(passed){
                countries[row.Country]["SmallTownPassed"] += 1;
              }
              else{
                countries[row.Country]["SmallTownFailed"] += 1 ;
              }
            }
            else if(row.SchoolLocation === "Town"){
              if(passed){
                countries[row.Country]["TownPassed"] += 1 ;
              }
              else{
                countries[row.Country]["TownFailed"] += 1 ;
              }
            }
            else if(row.SchoolLocation === "Village"){
              if(passed){
                countries[row.Country]["VillagePassed"] += 1 ;
              }
              else{
                countries[row.Country]["VillageFailed"] += 1 ;
              }
            }
            else if(row.SchoolLocation === "City"){
              if(passed){
                countries[row.Country]["CityPassed"] += 1 ;
              }
              else{
                countries[row.Country]["CityFailed"] += 1 ;
              }
            }
            else if(row.SchoolLocation === "Large City"){
              if(passed){
                countries[row.Country]["LargeCityPassed"] += 1;
              }
              else{
                countries[row.Country]["LargeCityFailed"] += 1;
              }
            }

            // Type
            if(row.SchoolType === "Private"){
              if(passed){
                countries[row.Country]["PrivatePassed"] += 1 ;
              }
              else{
                countries[row.Country]["PrivateFailed"] += 1 ;
              }
            }
            else if(row.SchoolType === "Public"){
              if(passed){
                countries[row.Country]["PublicPassed"] += 1 ;
              }
              else{
                countries[row.Country]["PublicFailed"] += 1 ;
              }
            }

            // Gender
            if(row.Boys !== null && row.Girls !== null){
              if(row.Boys !== 0 && row.Girls !== 0){
                if(passed){
                  countries[row.Country]["CoedPassed"] += 1 ;
                }
                else{
                  countries[row.Country]["CoedFailed"] += 1 ;
                }
              } 
              else if(row.Boys === 0 || row.Girls === 0){
                if(passed){
                  countries[row.Country]["NotCoedPassed"] += 1 ;
                }
                else{
                  countries[row.Country]["NotCoedFailed"] += 1 ;
                }
              } 
            }

            // Sports
            if(row.Sports === "Yes"){
              if(passed){
                countries[row.Country]["SportsPassed"] += 1;
              }
              else{
                countries[row.Country]["SportsFailed"] += 1;
              }
            }
            else if(row.Sports === "No"){
              if(passed){
                countries[row.Country]["NoSportsPassed"] += 1;
              }
              else{
                countries[row.Country]["NoSportsFailed"] += 1;
              }
            }

            //Arts
            if(row.Arts === "Yes"){
              if(passed){
                countries[row.Country]["ArtsPassed"] += 1;
              }
              else{
                countries[row.Country]["ArtsFailed"] += 1;
              }
            }
            else if(row.Arts === "No"){
              if(passed){
                countries[row.Country]["NoArtsPassed"] += 1;
              }
              else{
                countries[row.Country]["NoArtsFailed"] += 1;
              }
            }
          }
        }, function(){
          db.each("SELECT distinct Country from students", function(err, row) {

            db.run("UPDATE sportsParse SET SportsPassed = "+countries[row.Country]["SportsPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsParse SET SportsFailed = "+countries[row.Country]["SportsFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsParse SET NoSportsPassed = "+countries[row.Country]["NoSportsPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsParse SET NoSportsFailed = "+countries[row.Country]["NoSportsFailed"]+
              " WHERE Country = '"+row.Country+"'");

            db.run("UPDATE artsParse SET ArtsPassed = "+countries[row.Country]["ArtsPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE artsParse SET ArtsFailed = "+countries[row.Country]["ArtsFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE artsParse SET NoArtsPassed = "+countries[row.Country]["NoArtsPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE artsParse SET NoArtsFailed = "+countries[row.Country]["NoArtsFailed"]+
              " WHERE Country = '"+row.Country+"'");

            db.run("UPDATE artsParse SET ArtsPassed = "+countries[row.Country]["ArtsPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE artsParse SET ArtsFailed = "+countries[row.Country]["ArtsFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE artsParse SET NoArtsPassed = "+countries[row.Country]["NoArtsPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE artsParse SET NoArtsFailed = "+countries[row.Country]["NoArtsFailed"]+
              " WHERE Country = '"+row.Country+"'");

            db.run("UPDATE typeParse SET PrivatePassed = "+countries[row.Country]["PrivatePassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE typeParse SET PrivateFailed = "+countries[row.Country]["PrivateFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE typeParse SET PublicPassed = "+countries[row.Country]["PublicPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE typeParse SET PublicFailed = "+countries[row.Country]["PublicFailed"]+
              " WHERE Country = '"+row.Country+"'");

            db.run("UPDATE genderParse SET NotCoedPassed = "+countries[row.Country]["NotCoedPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE genderParse SET NotCoedFailed = "+countries[row.Country]["NotCoedFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE genderParse SET CoedPassed = "+countries[row.Country]["CoedPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE genderParse SET CoedFailed = "+countries[row.Country]["CoedFailed"]+
              " WHERE Country = '"+row.Country+"'");

            db.run("UPDATE locationParse SET SmallTownPassed = "+countries[row.Country]["SmallTownPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE locationParse SET SmallTownFailed = "+countries[row.Country]["SmallTownFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE locationParse SET CityPassed = "+countries[row.Country]["CityPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE locationParse SET CityFailed = "+countries[row.Country]["CityFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE locationParse SET VillagePassed = "+countries[row.Country]["VillagePassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE locationParse SET VillageFailed = "+countries[row.Country]["VillageFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE locationParse SET TownPassed = "+countries[row.Country]["TownPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE locationParse SET TownFailed = "+countries[row.Country]["TownFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE locationParse SET LargeCityPassed = "+countries[row.Country]["LargeCityPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE locationParse SET LargeCityFailed = "+countries[row.Country]["LargeCityFailed"]+
              " WHERE Country = '"+row.Country+"'");

          }, function(){
            console.log(countries);
          });
        });
      });
});
