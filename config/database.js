const mysql = require('mysql2/promise');
const { logger } = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
  host: process.env.LOCAL_DB_HOST,
  user: process.env.LOCAL_DB_USERNAME,
  port: process.env.LOCAL_DB_PORT,
  password: process.env.LOCAL_DB_PASSWORD,
  database: process.env.LOCAL_DB_DATABASE,
});

module.exports = {
  pool: pool,
};
