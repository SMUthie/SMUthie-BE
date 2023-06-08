const baseResponseStatus = require('../../../config/baseResponseStatus');
const { pool } = require('../../../config/database');
const { errResponse, response } = require('../../../config/response');
const { logger } = require('../../../config/winston');
const { verifyRToken, signAToken } = require('../../../util/jwtUtil');

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

exports.refreshTokenWithUserIdx = async function (rToken, userIdx) {
  if (!verifyRToken(rToken)) {
    return errResponse(baseResponseStatus.TOKEN_VERIFICATION_FAILURE);
  }

  const connection = await pool.getConnection(async (conn) => conn);
  const userRefreshTokenRows = await userDao.selectRefreshTokenUseUserIdx(
    connection,
    userIdx
  );
  connection.release();

  const dbRefreshToken = userRefreshTokenRows[0].token;
  if (dbRefreshToken != rToken) {
    return errResponse(baseResponseStatus.TOKEN_VERIFICATION_FAILURE);
  }

  const NEW_ACCESS_TOKEN = signAToken(userIdx);

  return response(baseResponseStatus.SUCCESS, {
    access_token: NEW_ACCESS_TOKEN,
  });
};
