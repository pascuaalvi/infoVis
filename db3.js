
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

  // db.run("CREATE TABLE sportsArtsTypeParse (Country TEXT PRIMARY KEY, "
  //   +"PrivateSportArtsPassed REAL, PrivateSportArtsFailed REAL, "
  //   +"PublicSportArtsPassed REAL, PublicSportArtsFailed REAL, "
  //   +"PrivateSportPassed REAL, PrivateSportFailed REAL, "
  //   +"PublicSportPassed REAL, PublicSportFailed REAL, "
  //   +"PrivateArtsPassed REAL, PrivateArtsFailed REAL, "
  //   +"PublicArtsPassed REAL, PublicArtsFailed REAL, "
  //   +"PrivateNonePassed REAL, PrivateNoneFailed REAL, "
  //   +"PublicNonePassed REAL, PublicNoneFailed REAL)");

  // var stmt = db.prepare("INSERT INTO sportsArtsTypeParse VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
  // db.each("SELECT distinct Country from students", function(err, row) {
  //     stmt.run(row.Country,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
  // });

  
  db.each("SELECT distinct Country from students", function(err, row) {
    countries[row.Country] = {
        "PrivateSportArtsPassed" : 0,
        "PrivateSportArtsFailed" : 0,
        "PublicSportArtsPassed" : 0,
        "PublicSportArtsFailed" : 0, 
        "PrivateSportPassed" : 0,
        "PrivateSportFailed" : 0,
        "PublicSportPassed" : 0,
        "PublicSportFailed" : 0, 
        "PrivateArtsPassed" : 0,
        "PrivateArtsFailed" : 0,
        "PublicArtsPassed" : 0,
        "PublicArtsFailed" : 0, 
        "PrivateNonePassed" : 0,
        "PrivateNoneFailed" : 0,
        "PublicNonePassed" : 0,
        "PublicNoneFailed" : 0, 
        };
      }, function(){
        // countries["Vietnam"]["SmallTownPassed"] += 1
        //console.log(countries);
       
        db.each("select country, iscedl, schoolType, arts, sports from school2012 inner join students on school2012.SCHOOLID = students.SchoolID and school2012.CNT = students.Country", 
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

            // Sports
            if(row.Sports === "Yes"){
              //Arts
              if(row.Arts === "Yes"){
                
                if(row.SchoolType === "Private"){
                  if(passed){
                    countries[row.Country]["PrivateSportArtsPassed"] += 1 ;
                  }
                  else{
                    countries[row.Country]["PrivateSportArtsFailed"] += 1 ;
                  }
                }
                else if(row.SchoolType === "Public"){
                  if(passed){
                    countries[row.Country]["PublicSportArtsPassed"] += 1 ;
                  }
                  else{
                    countries[row.Country]["PublicSportArtsFailed"] += 1 ;
                  }
                }
              }
              else if(row.Arts === "No"){

                if(row.SchoolType === "Private"){
                  if(passed){
                    countries[row.Country]["PrivateSportPassed"] += 1 ;
                  }
                  else{
                    countries[row.Country]["PrivateSportFailed"] += 1 ;
                  }
                }
                else if(row.SchoolType === "Public"){
                  if(passed){
                    countries[row.Country]["PublicSportPassed"] += 1 ;
                  }
                  else{
                    countries[row.Country]["PublicSportFailed"] += 1 ;
                  }
                }

              }
            }
            else if(row.Sports === "No"){
              if(row.Arts === "Yes"){

                if(row.SchoolType === "Private"){
                  if(passed){
                    countries[row.Country]["PrivateArtsPassed"] += 1 ;
                  }
                  else{
                    countries[row.Country]["PrivateArtsFailed"] += 1 ;
                  }
                }
                else if(row.SchoolType === "Public"){
                  if(passed){
                    countries[row.Country]["PublicArtsPassed"] += 1 ;
                  }
                  else{
                    countries[row.Country]["PublicArtsFailed"] += 1 ;
                  }
                }

              }
              else if(row.Arts === "No"){
                
                if(row.SchoolType === "Private"){
                  if(passed){
                    countries[row.Country]["PrivateNonePassed"] += 1 ;
                  }
                  else{
                    countries[row.Country]["PrivateNoneFailed"] += 1 ;
                  }
                }
                else if(row.SchoolType === "Public"){
                  if(passed){
                    countries[row.Country]["PublicNonePassed"] += 1 ;
                  }
                  else{
                    countries[row.Country]["PublicNoneFailed"] += 1 ;
                  }
                }  

              }
            }  
          }

        }, function(){
          db.each("SELECT distinct Country from students", function(err, row) {

            db.run("UPDATE sportsArtsTypeParse SET PrivateSportArtsPassed = "+countries[row.Country]["PrivateSportArtsPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PublicSportArtsPassed = "+countries[row.Country]["PublicSportArtsPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PrivateSportPassed = "+countries[row.Country]["PrivateSportPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PublicSportPassed = "+countries[row.Country]["PublicSportPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PrivateArtsPassed = "+countries[row.Country]["PrivateArtsPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PublicArtsPassed = "+countries[row.Country]["PublicArtsPassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PrivateNonePassed = "+countries[row.Country]["PrivateNonePassed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PublicNonePassed = "+countries[row.Country]["PublicNonePassed"]+
              " WHERE Country = '"+row.Country+"'");

            db.run("UPDATE sportsArtsTypeParse SET PrivateSportArtsFailed = "+countries[row.Country]["PrivateSportArtsFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PublicSportArtsFailed = "+countries[row.Country]["PublicSportArtsFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PrivateSportFailed = "+countries[row.Country]["PrivateSportFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PublicSportFailed = "+countries[row.Country]["PublicSportFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PrivateArtsFailed = "+countries[row.Country]["PrivateArtsFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PublicArtsFailed = "+countries[row.Country]["PublicArtsFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PrivateNoneFailed = "+countries[row.Country]["PrivateNoneFailed"]+
              " WHERE Country = '"+row.Country+"'");
            db.run("UPDATE sportsArtsTypeParse SET PublicNoneFailed = "+countries[row.Country]["PublicNoneFailed"]+
              " WHERE Country = '"+row.Country+"'");

          }, function(){
            console.log(countries);
          });
        });
      });
    
});
