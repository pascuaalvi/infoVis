
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
  // 1
  db.run("CREATE TABLE sportsParse (Country TEXT, "
    +"SportsPassed REAL, SportsFailed REAL, NoSportsPassed REAL, NoSportsFailed REAL,"
    +")");

  db.run("CREATE TABLE artsParse (Country TEXT, "
    +"ArtsPassed REAL, ArtsFailed REAL, NoArtsPassed REAL, NoArtsFailed REAL,"
    +")");

  db.run("CREATE TABLE typeParse (Country TEXT, "
    +"PrivatePassed REAL, PrivateFailed REAL, PublicPassed REAL, PublicFailed REAL,"
    +")");

  db.run("CREATE TABLE genderParse (Country TEXT, "
  +"CoedPassed REAL, CoedFailed REAL, NotCoedPassed REAL, NotCoedFailed REAL,"
  +")");

  // CHANGE THIS
  db.run("CREATE TABLE locationParse (Country TEXT, "
  +"PrivatePassed REAL, PrivateFailed REAL, PublicPassed REAL, PublicFailed REAL,"
  +")");
 
  var stmt = db.prepare("INSERT INTO sportsParse VALUES (?,?,?,?)");
  var stmt2 = db.prepare("INSERT INTO artsParse VALUES (?,?,?,?)");
  var stmt3 = db.prepare("INSERT INTO typeParse VALUES (?,?,?,?)");
  var stmt4 = db.prepare("INSERT INTO genderParse VALUES (?,?,?,?)");
  var stmt5 = db.prepare("INSERT INTO locationParse VALUES (?,?,?,?)");

  db.each("SELECT distinct Country from student", function(err, row) {
      stmt.run(row.Country,0,0,0,0);
      // ADD the others
  });
 
  // 2
  db.each("SELECT * from parseEverything", function(err, row) {
    console.log(row);
    if(row.ISCEDL === "ISCED level 3"){
      console.log("Passed");
      db.run("UPDATE detailParse SET LevelThree = LevelThree + 1 WHERE Country = '"+row.Country+"'");
    }
    else if(row.ISCEDL === "ISCED level 2" || row.ISCEDL === "ISCED level 1"){
      console.log("Few Years Behind");
      db.run("UPDATE detailParse SET LevelTwo = LevelTwo + 1 WHERE Country = '"+row.Country+"'");
    }
    else{
      console.log("A lost statistic.");
    }
  });
});

// end insanity