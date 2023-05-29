const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');

const userDao = require('./userDao');

// Provider: Read 비즈니스 로직 처리
exports.studentIdCheck = async function (student_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const StudentIdCheckResult = await userDao.selectUserStudentId(
    connection,
    student_id
  );
  connection.release();

  return StudentIdCheckResult;
};

exports.userLoginCheck = async function (student_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const loginUserResult = await userDao.selectLoginUserStudentId(
    connection,
    student_id
  );
  connection.release();

  return loginUserResult;
};
