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
})

app.get("/userList", (req, res) => {
  con.query("SELECT * FROM homepage_subscribers", function (err, result, fields) {
    if (err) throw err
    console.log(result)
    res.send({ users: result })
  })
})

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`)
})
