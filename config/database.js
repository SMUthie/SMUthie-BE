const mysql = require('mysql2/promise');
const {logger} = require('./winston');
const secret_config = require('./secret');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: secret_config.AWS_RDS_HOST,
    user: secret_config.AWS_RDS_USER,
    port: secret_config.AWS_RDS_PORT,
    password: secret_config.AWS_RDS_PASSWORD,
    database: secret_config.AWS_RDS_DATABASE
});

module.exports = {
    pool: pool
};