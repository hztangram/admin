const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
app.use(bodyParser.json())
app.use(cors())

const dotenv = require("dotenv")
dotenv.config({
  path: "./.env",
})

const mysql = require("./config/db")
const PORT = process.env.PORT || 8080

app.get("/get/users/emailSubscribers", (req, res) => {
  const sql = "SELECT * FROM homepage_subscribers"
  try {
    mysql.getConnection((err, connection) => {
      // Connection 연결
      console.log("emailSubscribers GET")
      if (err) throw err
      connection.query(sql, (err, result, fields) => {
        // Query문 전송
        if (err) {
          console.error("emailSubscribers GET Error / " + err)
          res.status(500).send("message : Internal Server Error")
        } else {
          if (result.length === 0) {
            res.status(400).send({
              success: false,
              message: "DB response Not Found",
            })
          } else {
            res.status(200).send({
              success: true,
              users: result,
            })
          }
        }
      })
      connection.release() // Connectino Pool 반환
    })
  } catch (err) {
    console.error("emailSubscribers GET Error / " + err)
    res.status(500).send("message : Internal Server Error")
  }
})

app.post("/update/users/emailSubscribers", async (req, res) => {
  var arr = req.body
  var sql
  var params
  var errorArr = []
  let index = 0
  try {
    for (let i = 0; i < arr.length + 1; i++) {
      sql = "select count(1) as dupleCnt from homepage_subscribers where email = ? and id <> ?"
      params = [arr[i].email, arr[i].id]
      mysql.query(sql, params, function (err, result) {
        if (err) throw err
        if (result.length > 0) {
          if (result[0].dupleCnt === 0) {
            // throw { message: item.id }
            const sql = "UPDATE homepage_subscribers SET email = ? , modified = CURRENT_TIMESTAMP WHERE id = ?"
            params = [arr[i].email, arr[i].id]
            mysql.query(sql, params, function (err, result) {
              if (err) throw err
            })
          } else {
            errorArr.push(arr[i].id)
          }
        }
        console.log(result.length)
      })

      if (arr.length === i) {
        console.log(O)
        if (errorArr.length > 0) {
          res.send({
            success: false,
            message: "이메일 중복",
            dupleCnt: errorArr,
          })
        } else {
          res.send({
            success: true,
            message: "OK",
          })
        }
      }
    }
  } catch (err) {
    res.send({
      success: false,
      err: err.message,
    })
  }
})

app.listen(PORT, () => console.log(`Server Start Listening on port ${PORT}`))
