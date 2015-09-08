
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
db.serialize(function() {
  // 1
  // db.run("CREATE TABLE studentParse (Country TEXT, LevelThree REAL, LevelTwo REAL, LevelOne REAL)");
 
  // var stmt = db.prepare("INSERT INTO studentParse VALUES (?,?,?,?)");
  // db.each("SELECT distinct Country from student", function(err, row) {
  //     stmt.run(row.Country,0,0,0);
  // });
 
  // 2
  db.each("SELECT ISCEDL, Country from student", function(err, row) {
    //console.log(row.ISCEDL + ": " + row.Country);
    if(row.ISCEDL === "ISCED level 3"){
      console.log("Passed");
      db.run("UPDATE studentParse SET LevelThree = LevelThree + 1 WHERE Country = '"+row.Country+"'");
    }
    else if(row.ISCEDL === "ISCED level 2"){
      console.log("Few Years Behind");
      db.run("UPDATE studentParse SET LevelTwo = LevelTwo + 1 WHERE Country = '"+row.Country+"'");
    }
    else if(row.ISCEDL === "ISCED level 1"){
      console.log("Really Behind");
      db.run("UPDATE studentParse SET LevelOne = LevelOne + 1 WHERE Country = '"+row.Country+"'");
    }
    else{
      console.log("A lost statistic.");
    }
  });
});
// end crazy