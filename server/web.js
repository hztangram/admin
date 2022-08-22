const express = require("express")
const cookieParser = require("cookie-parser")

const cors = require("cors")
const bodyParser = require("body-parser")

const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
dotenv.config({
  path: "./.env",
})
const mysql = require("./config/db")

const session = require("express-session")
const FileStore = require("session-file-store")(session)

const app = express()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
const corsOptions = {
  origin: true,
  credentials: true,
}
app.use(cors(corsOptions))
app.use(cookieParser())

const oneDay = 1000 * 60 * 60 * 24
app.use(
  session({
    // key: 'loginData',
    // secret: process.env.SECRET,
    // resave: false,
    // saveUninitialized: true,
    // cookie: { secure: false, maxAge: oneDay },

    HttpOnly: true,
    secure: true,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: "none", maxAge: 24000 * 60 * 60, secure: true },
  })
)

const PORT = process.env.PORT || 8080
const saltRounds = 10

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

app.post("/api/login", async (req, res) => {
  let { email, password } = req.body
  let connection
  try {
    connection = await mysql.getConnection()
    await connection.beginTransaction()

    const findEmail = `
    SELECT *
    FROM admin_members
    WHERE email = '${email}'
      `
    const emailResult = await connection.query(findEmail)
    if (emailResult[0].length > 0) {
      const user = emailResult[0][0]
      const compare = bcrypt.compareSync(password, user.passwd)
      console.log(req.session)
      if (compare) {
        req.session.uid = user.id
        req.session.author_email = user.email
        req.session.author_name = user.name
        req.session.isLoggedIn = true
        req.session.save(function (err) {
          if (err) res.send(err)
          res.send({
            success: true,
            message: "로그인 성공!",
            code: 0,
          })
          console.log(req.session)
        })
      } else {
        res.send({
          success: false,
          message: "로그인 실패 | 비밀번호 불일치",
          code: 2,
        })
      }
    } else {
      res.send({
        success: false,
        message: "로그인 실패 | 일치하는 이메일 없음",
        code: 1,
      })
    }
    await connection.commit()
    await connection.release()
  } catch (err) {
    await connection.rollback()
    await connection.release()

    res.send({
      success: false,
      message: err.message,
      code: err.code,
    })
  }
})

app.post("/api/checklogin", async (req, res) => {
  const result = req.session.isLoggedIn
  if (req.session.isLoggedIn) {
    res.send({ isLoggedIn: result })
  } else {
    res.send({ success: false })
  }
  console.log(req.session)
})
app.post("/api/checklogin2", async (req, res) => {
  const result = true
  if (req.session.isLoggedIn) {
    res.send({ isLoggedIn: result })
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
