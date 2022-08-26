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
  origin: "http://tangramfactory.com",
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
    cookie: { maxAge: 24000 * 60 * 60, sameSite: "none" },
  })
)

const PORT = process.env.PORT || 8080
const saltRounds = 10

app.post("/api/tgAdmin/get/emailSubscribers", async (req, res) => {
  let result = []
  let total = null
  const { currentPage, pageSize } = req.body
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

app.post("/api/tgAdmin/update/emailSubscribers", async (req, res) => {
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

app.post("/api/tgAdmin/delete/emailSubscribers", async (req, res) => {
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

app.post("/api/tgAdmin/register", async (req, res) => {
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

app.post("/api/tgAdmin/login", async (req, res) => {
  let { email, password } = req.body
  let connection

  res.header("Access-Control-Allow-Origin", "http://tangramfactory.com")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")

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
            sessionis: req.session.isLoggedIn,
          })
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

    console.log(req.session)
  }
})

app.post("/api/tgAdmin/checklogin", async (req, res) => {
  if (req.session.isLoggedIn) {
    res.send({ isLoggedIn: true, userName: req.session.author_name })
  } else {
    res.send({ isLoggedIn: false })
  }
  console.log(req.session)
})

app.listen(PORT, () => console.log(`Server Start Listening on port ${PORT}`))
