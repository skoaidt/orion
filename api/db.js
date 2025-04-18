import mysql from "mysql2";
import sql from "mssql";
import "dotenv/config";

// // MySQL 설정
// export const db = mysql.createConnection({
//   host: process.env.LOCAL_DB_HOST,
//   user: process.env.LOCAL_DB_USER,
//   password: process.env.LOCAL_DB_PASSWORD,
//   database: process.env.LOCAL_DB_NAME,
// });

export const db = mysql.createConnection({
  host: process.env.SPECIAL_HOST,
  user: process.env.SPECIAL_USER,
  password: process.env.SPECIAL_PASSWORD,
  database: process.env.SPECIAL_DB_NAME,
});

// MSSQL 설정
const mssqlConfig = {
  user: process.env.OPARKDB_USER,
  password: process.env.OPARKDB_PASSWORD,
  server: process.env.OPARKDB_SERVER,
  port: parseInt(process.env.OPARKDB_PORT, 10),
  options: {
    encrypt: false, // MSSQL 서버 설정에 따라 변경
    enableArithAbort: true,
  },
};

// MSSQL 연결 생성
export const mssql = new sql.ConnectionPool(mssqlConfig);
