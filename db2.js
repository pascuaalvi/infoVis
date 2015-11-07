
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

// start crazy
// db.serialize(function() {
//   // 1
//   db.run("CREATE TABLE studentParse (Country TEXT, LevelThree REAL, LevelTwo REAL, LevelOne REAL)");
 
//   var stmt = db.prepare("INSERT INTO studentParse VALUES (?,?,?,?)");
//   db.each("SELECT distinct Country from student", function(err, row) {
//       stmt.run(row.Country,0,0,0);
//   });
 
//   // 2
//   db.each("SELECT ISCEDL, Country from student", function(err, row) {
//     //console.log(row.ISCEDL + ": " + row.Country);
//     if(row.ISCEDL === "ISCED level 3"){
//       console.log("Passed");
//       db.run("UPDATE studentParse SET LevelThree = LevelThree + 1 WHERE Country = '"+row.Country+"'");
//     }
//     else if(row.ISCEDL === "ISCED level 2"){
//       console.log("Few Years Behind");
//       db.run("UPDATE studentParse SET LevelTwo = LevelTwo + 1 WHERE Country = '"+row.Country+"'");
//     }
//     else if(row.ISCEDL === "ISCED level 1"){
//       console.log("Really Behind");
//       db.run("UPDATE studentParse SET LevelOne = LevelOne + 1 WHERE Country = '"+row.Country+"'");
//     }
//     else{
//       console.log("A lost statistic.");
//     }
//   });
// });
// end crazy

var countries = [];
/*
var SportsPassed = 0;
var SportsFailed = 0;
var NoSportsPassed = 0;
var NoSportsFailed = 0;

var ArtsPassed = 0;
var ArtsFailed = 0;
var NoArtsPassed = 0;
var NoSportsFailed = 0;

var PrivatePassed = 0;
var PrivateFailed = 0;
var PublicPassed = 0;
var PublicFailed = 0;

var CoedPassed = 0;
var CoedFailed = 0;
var NotCoedPassed = 0;
var NotCoedFailed = 0;

var SmallTownPassed = 0;
var SmallTownFailed = 0;
var CityPassed = 0;
var CityFailed = 0;
var VillagePassed = 0;
var TownPassed = 0;
var TownFailed = 0;
var LargeCityPassed = 0;
var LargeCityFailed = 0;
*/

// start insanity

db.serialize(function() {
  /*
  // 1
  db.run("CREATE TABLE sportsParse (Country TEXT PRIMARY KEY, "
    +"SportsPassed REAL, SportsFailed REAL, NoSportsPassed REAL, NoSportsFailed REAL"
    +")");

  db.run("CREATE TABLE artsParse (Country TEXT PRIMARY KEY, "
    +"ArtsPassed REAL, ArtsFailed REAL, NoArtsPassed REAL, NoArtsFailed REAL"
    +")");

  db.run("CREATE TABLE typeParse (Country TEXT PRIMARY KEY, "
    +"PrivatePassed REAL, PrivateFailed REAL, PublicPassed REAL, PublicFailed REAL"
    +")");

  db.run("CREATE TABLE genderParse (Country TEXT PRIMARY KEY, "
  +"CoedPassed REAL, CoedFailed REAL, NotCoedPassed REAL, NotCoedFailed REAL"
  +")");

  db.run("CREATE TABLE locationParse (Country TEXT PRIMARY KEY, "
  +"SmallTownPassed REAL, SmallTownFailed REAL,"
  +"CityPassed REAL, CityFailed REAL,"
  +"VillagePassed REAL, VillageFailed REAL,"
  +"TownPassed REAL, TownFailed REAL,"
  +"LargeCityPassed REAL, LargeCityFailed REAL"
  +")");

  var stmt = db.prepare("INSERT INTO sportsParse VALUES (?,?,?,?,?)");
  var stmt2 = db.prepare("INSERT INTO artsParse VALUES (?,?,?,?,?)");
  var stmt3 = db.prepare("INSERT INTO typeParse VALUES (?,?,?,?,?)");
  var stmt4 = db.prepare("INSERT INTO genderParse VALUES (?,?,?,?,?)");
  var stmt5 = db.prepare("INSERT INTO locationParse VALUES (?,?,?,?,?,?,?,?,?,?,?)");

  db.each("SELECT distinct Country from students", function(err, row) {
      stmt.run(row.Country,0,0,0,0);
      stmt2.run(row.Country,0,0,0,0);
      stmt3.run(row.Country,0,0,0,0);
      stmt4.run(row.Country,0,0,0,0);
      stmt5.run(row.Country,0,0,0,0,0,0,0,0,0,0);
  });
  */

  db.each("SELECT distinct Country from students", function(err, row) {
    countries[row.Country] = {
        "SportsPassed" : 0,
        "SportsFailed" : 0,
        "NoSportsPassed" : 0,
        "NoSportsFailed" : 0,
        "ArtsPassed" : 0,
        "ArtsFailed" : 0,
        "NoArtsPassed" : 0,
        "NoSportsFailed" : 0,
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
        "TownPassed" : 0,
        "TownFailed" : 0,
        "LargeCityPassed" : 0,
        "LargeCityFailed" : 0,        
        };
      }, function(){;

        db.each("select country, iscedl, schoolType, schoolLocation, arts, sports, girls, boys from school2012 inner join students on school2012.SCHOOLID = students.SchoolID and school2012.CNT = students.Country", function(err, row) {
          console.log(row);
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
        });

      }, function(){
        console.log(countries);
      });


  // // 2
  // db.each("select country, iscedl, schoolType, schoolLocation, arts, sports, girls, boys from school2012 inner join students on school2012.SCHOOLID = students.SchoolID and school2012.CNT = students.Country", function(err, row) {
  //   console.log(row);
  //   var invalid = false;
  //   var passed = false;
  //   if(row.ISCEDL === "ISCED level 3"){
  //     passed = true;
  //     //db.run("UPDATE detailParse SET LevelThree = LevelThree + 1 WHERE Country = '"+row.Country+"'");
  //   }
  //   else if(row.ISCEDL === "ISCED level 2" || row.ISCEDL === "ISCED level 1"){
  //     passed = false;
  //     //db.run("UPDATE detailParse SET LevelTwo = LevelTwo + 1 WHERE Country = '"+row.Country+"'");
  //   }
  //   else{
  //     invalid = true;
  //   }
    
  //   if(!invalid){
        
  //     // Location
  //     if(row.SchoolLocation === "Small Town"){
  //       if(passed){
  //         SmallTownPassed = SmallTownPassed + 1 ;
  //       }
  //       else{
  //         SmallTownFailed = SmallTownFailed + 1 ;
  //       }
  //     }
  //     else if(row.SchoolLocation === "Town"){
  //       if(passed){
  //         TownPassed = TownPassed + 1 ;
  //       }
  //       else{
  //         TownFailed = TownFailed + 1 ;
  //       }
  //     }
  //     else if(row.SchoolLocation === "Village"){
  //       if(passed){
  //         VillagePassed = VillagePassed + 1 ;
  //       }
  //       else{
  //         VillageFailed = VillageFailed + 1 ;
  //       }
  //     }
  //     else if(row.SchoolLocation === "City"){
  //       if(passed){
  //         CityPassed = CityPassed + 1 ;
  //       }
  //       else{
  //         CityFailed = CityFailed + 1 ;
  //       }
  //     }
  //     else if(row.SchoolLocation === "Large City"){
  //       if(passed){
  //         LargeCityPassed = LargeCityPassed + 1;
  //       }
  //       else{
  //         LargeCityFailed = LargeCityFailed + 1;
  //       }
  //     }

  //     // Type
  //     if(row.SchoolType === "Private"){
  //       if(passed){
  //         PrivatePassed = PrivatePassed + 1 ;
  //       }
  //       else{
  //         PrivateFailed = PrivateFailed + 1 ;
  //       }
  //     }
  //     else if(row.SchoolType === "Public"){
  //       if(passed){
  //         PublicPassed = PublicPassed + 1 ;
  //       }
  //       else{
  //         PublicFailed = PublicFailed + 1 ;
  //       }
  //     }

  //     // Gender
  //     if(row.Boys !== null && row.Girls !== null){
  //       if(row.Boys !== 0 && row.Girls !== 0){
  //         if(passed){
  //           genderParse SET CoedPassed = CoedPassed + 1 ;
  //         }
  //         else{
  //           enderParse SET CoedFailed = CoedFailed + 1 ;
  //         }
  //       } 
  //       else if(row.Boys === 0 || row.Girls === 0){
  //         if(passed){
  //           genderParse SET NotCoedPassed = NotCoedPassed + 1 ;
  //         }
  //         else{
  //           genderParse SET NotCoedFailed = NotCoedFailed + 1 ;
  //         }
  //       } 
  //     }

  //     // Sports
  //     if(row.Sports === "Yes"){
  //       if(passed){
  //         SportsPassed += 1;
  //       }
  //       else{
  //         SportsFailed += 1;
  //       }
  //     }
  //     else if(row.Sports === "No"){
  //       if(passed){
  //         NoSportsPassed += 1;
  //       }
  //       else{
  //         NoSportsFailed += 1;
  //       }
  //     }

  //     //Arts
  //     if(row.Arts === "Yes"){
  //       if(passed){
  //         ArtsPassed += 1;
  //       }
  //       else{
  //         ArtsFailed += 1;
  //       }
  //     }
  //     else if(row.Arts === "No"){
  //       if(passed){
  //         NoArtsPassed += 1;
  //       }
  //       else{
  //         NoArtsFailed += 1;
  //       }
  //     }
  //   }
  // });

});

// end insanity