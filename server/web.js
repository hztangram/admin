const express = require("express");
const mysql = require("mysql");
const connection = require("./config/database");

const app = express();

// configuration =========================
app.set("port", process.env.PORT || 8000);

app.get("/", (req, res) => {
  res.send("Root");
});

app.get("/test", (req, res) => {
  connection.query("SELECT * from homepage_subscribers", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
  // connection.end();
});

//

// app.get("/test", (req, res) => {
//   connection.query("SELECT * from homepage_subscribers", (error, rows) => {
//     if (error) throw error;
//     console.log("User info is: ", rows);
//     res.send(rows);
//   });
// });

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});
