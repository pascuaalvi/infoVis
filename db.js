
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

// start insanity

db.serialize(function() {

  // // 1
  // db.run("CREATE TABLE sportsParse (Country TEXT PRIMARY KEY, "
  //   +"SportsPassed REAL, SportsFailed REAL, NoSportsPassed REAL, NoSportsFailed REAL"
  //   +")");

  // db.run("CREATE TABLE artsParse (Country TEXT PRIMARY KEY, "
  //   +"ArtsPassed REAL, ArtsFailed REAL, NoArtsPassed REAL, NoArtsFailed REAL"
  //   +")");

  // db.run("CREATE TABLE typeParse (Country TEXT PRIMARY KEY, "
  //   +"PrivatePassed REAL, PrivateFailed REAL, PublicPassed REAL, PublicFailed REAL"
  //   +")");

  // db.run("CREATE TABLE genderParse (Country TEXT PRIMARY KEY, "
  // +"CoedPassed REAL, CoedFailed REAL, NotCoedPassed REAL, NotCoedFailed REAL"
  // +")");

  // db.run("CREATE TABLE locationParse (Country TEXT PRIMARY KEY, "
  // +"SmallTownPassed REAL, SmallTownFailed REAL,"
  // +"CityPassed REAL, CityFailed REAL,"
  // +"VillagePassed REAL, VillageFailed REAL,"
  // +"TownPassed REAL, TownFailed REAL,"
  // +"LargeCityPassed REAL, LargeCityFailed REAL"
  // +")");

  // var stmt = db.prepare("INSERT INTO sportsParse VALUES (?,?,?,?,?)");
  // var stmt2 = db.prepare("INSERT INTO artsParse VALUES (?,?,?,?,?)");
  // var stmt3 = db.prepare("INSERT INTO typeParse VALUES (?,?,?,?,?)");
  // var stmt4 = db.prepare("INSERT INTO genderParse VALUES (?,?,?,?,?)");
  // var stmt5 = db.prepare("INSERT INTO locationParse VALUES (?,?,?,?,?,?,?,?,?,?,?)");

  // db.each("SELECT distinct Country from students", function(err, row) {
  //     stmt.run(row.Country,0,0,0,0);
  //     stmt2.run(row.Country,0,0,0,0);
  //     stmt3.run(row.Country,0,0,0,0);
  //     stmt4.run(row.Country,0,0,0,0);
  //     stmt5.run(row.Country,0,0,0,0,0,0,0,0,0,0);
  // });


  // 2
  db.each("SELECT * from parseEverything", function(err, row) {
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
          db.run("UPDATE locationParse SET SmallTownPassed = SmallTownPassed + 1 WHERE Country = '"+row.Country+"'");
        }
        else{
          db.run("UPDATE locationParse SET SmallTownFailed = SmallTownFailed + 1 WHERE Country = '"+row.Country+"'");
        }
      }
      else if(row.SchoolLocation === "Town"){
        if(passed){
          db.run("UPDATE locationParse SET TownPassed = TownPassed + 1 WHERE Country = '"+row.Country+"'");
        }
        else{
          db.run("UPDATE locationParse SET TownFailed = TownFailed + 1 WHERE Country = '"+row.Country+"'");
        }
      }
      else if(row.SchoolLocation === "Village"){
        if(passed){
          db.run("UPDATE locationParse SET VillagePassed = VillagePassed + 1 WHERE Country = '"+row.Country+"'");
        }
        else{
          db.run("UPDATE locationParse SET VillageFailed = VillageFailed + 1 WHERE Country = '"+row.Country+"'");
        }
      }
      else if(row.SchoolLocation === "City"){
        if(passed){
          db.run("UPDATE locationParse SET CityPassed = CityPassed + 1 WHERE Country = '"+row.Country+"'");
        }
        else{
          db.run("UPDATE locationParse SET CityFailed = CityFailed + 1 WHERE Country = '"+row.Country+"'");
        }
      }
      else if(row.SchoolLocation === "Large city"){
        if(passed){
          db.run("UPDATE locationParse SET LargeCityPassed = LargeCityPassed + 1 WHERE Country = '"+row.Country+"'");
        }
        else{
          db.run("UPDATE locationParse SET LargeCityFailed = LargeCityFailed + 1 WHERE Country = '"+row.Country+"'");
        }
      }

      // Type
      if(row.SchoolType === "Private"){
        if(passed){
          db.run("UPDATE typeParse SET PrivatePassed = PrivatePassed + 1 WHERE Country = '"+row.Country+"'");
        }
        else{
          db.run("UPDATE typeParse SET PrivateFailed = PrivateFailed + 1 WHERE Country = '"+row.Country+"'");
        }
      }
      else if(row.SchoolType === "Public"){
        if(passed){
          db.run("UPDATE typeParse SET PublicPassed = PublicPassed + 1 WHERE Country = '"+row.Country+"'");
        }
        else{
          db.run("UPDATE typeParse SET PublicFailed = PublicFailed + 1 WHERE Country = '"+row.Country+"'");
        }
      }

      // Gender
      if(row.Boys !== null && row.Girls !== null){
        if(row.Boys !== 0 && row.Girls !== 0){
          if(passed){
            db.run("UPDATE genderParse SET CoedPassed = CoedPassed + 1 WHERE Country = '"+row.Country+"'");
          }
          else{
            db.run("UPDATE genderParse SET CoedFailed = CoedFailed + 1 WHERE Country = '"+row.Country+"'");
          }
        } 
        else if(row.Boys === 0 || row.Girls === 0){
          if(passed){
            db.run("UPDATE genderParse SET NotCoedPassed = NotCoedPassed + 1 WHERE Country = '"+row.Country+"'");
          }
          else{
            db.run("UPDATE genderParse SET NotCoedFailed = NotCoedFailed + 1 WHERE Country = '"+row.Country+"'");
          }
        } 
      }

      // Sports
      if(row.Sports === "Yes"){
        if(passed){
          db.run("UPDATE sportsParse SET SportsPassed = SportsPassed + 1 WHERE Country = '"+row.Country+"'");
        }
        else{
          db.run("UPDATE sportsParse SET SportsFailed = SportsFailed + 1 WHERE Country = '"+row.Country+"'");
        }
      }
      else if(row.Sports === "No"){
        if(passed){
          db.run("UPDATE sportsParse SET NoSportsPassed = NoSportsPassed + 1 WHERE Country = '"+row.Country+"'");
        }
        else{
          db.run("UPDATE sportsParse SET NoSportsFailed = NoSportsFailed + 1 WHERE Country = '"+row.Country+"'");
        }
      }

      //Arts
      if(row.Arts === "Yes"){
        if(passed){
          db.run("UPDATE artsParse SET ArtsPassed = ArtsPassed + 1 WHERE Country = '"+row.Country+"'");
          console.log("Pass Yes")
        }
        else{
          db.run("UPDATE artsParse SET ArtsFailed = ArtsFailed + 1 WHERE Country = '"+row.Country+"'");
          console.log("Fail Yes")

        }
      }
      else if(row.Arts === "No"){
        if(passed){
          db.run("UPDATE artsParse SET NoArtsPassed = NoArtsPassed + 1 WHERE Country = '"+row.Country+"'");
          console.log("Pass No")

        }
        else{
          db.run("UPDATE artsParse SET NoArtsFailed = NoArtsFailed + 1 WHERE Country = '"+row.Country+"'");
          console.log("Fail No")

        }
      }
    }
  });
});

// end insanity