const mysql = require("mysql2/promise")
const path = require("path") // 파일 경로 모듈
require("dotenv").config({ path: path.join(__dirname, "./env/server.env") }) //env 로드 모듈

const connection = {
  host: process.env.DATABASE_SPRINT_HOST,
  user: process.env.DATABASE_SPRINT_USER,
  password: process.env.DATABASE_SPRINT_PASSWORD,
  database: process.env.DATABASE_SPRINT_NAME,
  multipleStatements: true,
  // connectionLimit: 30, // 커넥션수 30개로 설정
}

const pool = mysql.createPool(connection)

// async function mysqlCreatepool() {
//   const result = await mysql.createPool(connection)
//   return result
// }

module.exports = pool

// const mysql = require("mysql")
// const path = require("path") // 파일 경로 모듈
// require("dotenv").config({ path: path.join(__dirname, "./env/server.env") }) //env 로드 모듈

// const connection = {
//   host: process.env.DATABASE_SPRINT_HOST,
//   user: process.env.DATABASE_SPRINT_USER,
//   password: process.env.DATABASE_SPRINT_PASSWORD,
//   database: process.env.DATABASE_SPRINT_NAME,
//   multipleStatements: true,
//   // connectionLimit: 30, // 커넥션수 30개로 설정
// }

// module.exports = mysql.createPool(connection)
