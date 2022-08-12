const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080

const cors = require("cors")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

const dotenv = require("dotenv")
dotenv.config()
const mysql = require("mysql")

var con = mysql.createConnection({
  host: process.env.DATABASE_SPRINT_HOST,
  user: process.env.DATABASE_SPRINT_USER,
  password: process.env.DATABASE_SPRINT_PASSWORD,
  database: process.env.DATABASE_SPRINT_NAME,

  multipleStatements: true,
})

app.get("/get/users/emailSubscribers", (req, res) => {
  con.query("SELECT * FROM homepage_subscribers", function (err, result, fields) {
    if (err) throw err
    res.send({ users: result })
  })
})
app.post("/update/users/emailSubscribers", (req, res) => {
  // var arr = req.body
  // var sql
  // var params
  // for (let item of arr) {
  //   sql = "UPDATE homepage_subscribers SET email = ? , path = ? , options = ?, modified = CURRENT_TIMESTAMP WHERE id = ?"
  //   params = [item.email, item.path, item.options, item.id]
  //   con.query(sql, params, function (err, result) {
  //     if (err) throw err
  //     console.log(arr)
  //     res.send(result)
  //   })
  // }

  var arr = req.body
  var sql
  var params
  for (let item of arr) {
    sql = "UPDATE homepage_subscribers SET email = ? , modified = CURRENT_TIMESTAMP WHERE id = ?"
    params = [item.email, item.id]
    con.query(sql, params, function (err, result) {
      if (err) throw err
    })
  }
  res.send("OK")
})

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`)
})
