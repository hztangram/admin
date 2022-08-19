const express = require("express")
const session = require("express-session")

const cors = require("cors")
const bodyParser = require("body-parser")

const bcrypt = require("bcrypt")

const dotenv = require("dotenv")
dotenv.config({
  path: "./.env",
})
const FileStore = require("session-file-store")(session)

const app = express()
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)

app.use(bodyParser.json())
app.use(cors())
app.use(
  session({
    secret: "blah blah",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
)

const mysql = require("./config/db")
const PORT = process.env.PORT || 8080

app.get("/test", (req, res) => {
  console.log(req.session) // session 생긴다!
  res.send("session")
})

app.post("/get/users/emailSubscribers", async (req, res) => {
  let result = []
  let total = null
  const { currentPage, pageSize } = req.body
  console.log(currentPage)
  try {
    const emailSubscribersSql = `
      SELECT *
      FROM homepage_subscribers
      WHERE SUBSTR(options, -1) = '1'
      LIMIT ${currentPage}, ${pageSize}
      `
    const totalSql = `
      SELECT COUNT(*) AS cnt
      FROM homepage_subscribers
      WHERE SUBSTR(options, -1) = '1'
      `

    const emailSubscribersSqlResult = await mysql.query(emailSubscribersSql, [currentPage, pageSize])
    const emailSubscribersSqlTotal = await mysql.query(totalSql)

    if (emailSubscribersSqlResult.length > 0) {
      result = emailSubscribersSqlResult[0]
    }
    if (emailSubscribersSqlTotal.length > 0) {
      total = emailSubscribersSqlTotal[0][0].cnt
    }
    res.status(200).send({
      success: true,
      users: result,
      total: total,
    })
  } catch (err) {
    console.error("emailSubscribers GET Error / " + err.message)
    res.status(500).send("message : Internal Server Error")
  }
})

app.post("/update/users/emailSubscribers", async (req, res) => {
  var arr = req.body
  var errorArr = []
  let connection
  try {
    connection = await mysql.getConnection()
    await connection.beginTransaction()
    for (item of arr) {
      const emailDupleSql = `
        SELECT COUNT(1) AS dupleCnt
        FROM homepage_subscribers
        WHERE email = '${item.email}'
        AND id <> ${item.id}
      `
      const emailDupleCnt = await connection.query(emailDupleSql)

      if (emailDupleCnt[0].length > 0) {
        if (emailDupleCnt[0][0].dupleCnt > 0) {
          errorArr.push(item.id)
          continue
        }
      }

      const emailUpdateInfo = `
        UPDATE homepage_subscribers
        SET email = '${item.email}'
        , path = '${item.path}'
        , options = '${item.options}'
        , modified = CURRENT_TIMESTAMP
        WHERE id = ${item.id}
      `
      const emailUpdateInfoResult = await connection.query(emailUpdateInfo)
    }
    if (errorArr.length > 0) {
      await connection.rollback()
      await connection.release()
      res.send({
        success: false,
        message: "이메일 중복",
        dupleIdArr: errorArr,
      })
    } else {
      await connection.commit()
      await connection.release()
      res.send({
        success: true,
        message: "OK",
      })
    }
  } catch (err) {
    await connection.rollback()
    await connection.release()
    res.send({
      success: false,
      err: err.message,
    })
  }
})

app.post("/delete/users/emailSubscribers", async (req, res) => {
  var arr = req.body
  let connection
  try {
    connection = await mysql.getConnection()
    await connection.beginTransaction()
    for (item of arr) {
      const emailDeleteInfo = `
        UPDATE homepage_subscribers
        SET options = '${item.options}'
        , modified = CURRENT_TIMESTAMP
        WHERE id = ${item.id}
      `
      const emailDeleteInfoResult = await connection.query(emailDeleteInfo)
    }

    await connection.commit()
    await connection.release()
    res.send({
      success: true,
      message: "OK",
    })
  } catch (err) {
    await connection.rollback()
    await connection.release()
    res.send({
      success: false,
      err: err.message,
    })
  }
})

app.post("/register", async (req, res) => {
  const saltRounds = 10
  let { name, email, password } = req.body
  let connection
  try {
    connection = await mysql.getConnection()
    await connection.beginTransaction()

    const hash = await bcrypt.hash(password, saltRounds)
    password = hash

    const memberInsertInfo = `
        INSERT INTO admin_members
        (email, name, passwd, insert_dt, update_dt)
        VALUES
        ('${email}','${name}','${password}', CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      `
    const memberInsertInfoResult = await connection.query(memberInsertInfo)

    await connection.commit()
    await connection.release()
    res.send({
      success: true,
      message: "OK",
    })
  } catch (err) {
    await connection.rollback()
    await connection.release()

    if (err.code === "ER_DUP_ENTRY") {
      res.send({
        success: false,
        err: err.message,
        code: 1, //이메일 중복
      })
    } else {
      res.send({
        success: false,
        err: err.message,
        code: err.code,
      })
    }
  }
})

app.listen(PORT, () => console.log(`Server Start Listening on port ${PORT}`))

// app.get("/get/users/emailSubscribers", async (req, res) => {
//   let result = []
//   try {
//     const emailSubscribersSql = "SELECT * FROM homepage_subscribers"

//     const emailSubscribersSqlResult = await mysql.query(emailSubscribersSql)

//     if (emailSubscribersSqlResult.length > 0) {
//       result = emailSubscribersSqlResult[0]
//     }
//     res.status(200).send({
//       success: true,
//       users: result,
//     })
//   } catch (err) {
//     console.error("emailSubscribers GET Error / " + err.message)
//     res.status(500).send("message : Internal Server Error")
//   }
// })

// app.get("/get/users/emailSubscribers", (req, res) => {
//   const sql = "SELECT * FROM homepage_subscribers"
//   try {
//     mysql.getConnection((err, connection) => {
//       // Connection 연결
//       console.log("emailSubscribers GET")
//       if (err) throw err
//       connection.query(sql, (err, result, fields) => {
//         // Query문 전송
//         if (err) {
//           console.error("emailSubscribers GET Error / " + err)
//           res.status(500).send("message : Internal Server Error")
//         } else {
//           if (result.length === 0) {
//             res.status(400).send({
//               success: false,
//               message: "DB response Not Found",
//             })
//           } else {
//             res.status(200).send({
//               success: true,
//               users: result,
//             })
//           }
//         }
//       })
//       connection.release() // Connectino Pool 반환
//     })
//   } catch (err) {
//     console.error("emailSubscribers GET Error / " + err)
//     res.status(500).send("message : Internal Server Error")
//   }
// })

// app.post("/update/users/emailSubscribers", async (req, res) => {
//   var arr = req.body
//   var sql
//   var params
//   var errorArr = []
//   let index = 0
//   try {
//     for (let i = 0; i < arr.length + 1; i++) {
//       sql = "select count(1) as dupleCnt from homepage_subscribers where email = ? and id <> ?"
//       params = [arr[i].email, arr[i].id]
//       mysql.query(sql, params, function (err, result) {
//         if (err) throw err
//         if (result.length > 0) {
//           if (result[0].dupleCnt === 0) {
//             // throw { message: item.id }
//             const sql = "UPDATE homepage_subscribers SET email = ? , modified = CURRENT_TIMESTAMP WHERE id = ?"
//             params = [arr[i].email, arr[i].id]
//             mysql.query(sql, params, function (err, result) {
//               if (err) throw err
//             })
//           } else {
//             errorArr.push(arr[i].id)
//           }
//         }
//         console.log(result.length)
//       })

//       if (arr.length === i) {
//         console.log(O)
//         if (errorArr.length > 0) {
//           res.send({
//             success: false,
//             message: "이메일 중복",
//             dupleCnt: errorArr,
//           })
//         } else {
//           res.send({
//             success: true,
//             message: "OK",
//           })
//         }
//       }
//     }
//   } catch (err) {
//     res.send({
//       success: false,
//       err: err.message,
//     })
//   }
// })
