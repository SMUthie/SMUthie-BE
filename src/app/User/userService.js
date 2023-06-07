const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const secret_config = require('../../../config/secret');
const userProvider = require('./userProvider');
const userDao = require('./userDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { connect } = require('http2');
const { log } = require('console');

// Service: Create, Update, Delete 비즈니스 로직 처리
exports.createUser = async function (student_id, password, nickname) {
  try {
    // 학번 중복 확인
    const student_id_user = await userProvider.studentIdCheck(student_id);
    if (student_id_user.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_STUDENT_ID);

    // 비밀번호 암호화
    const hashedPassword = await crypto
      .createHash('sha512')
      .update(password)
      .digest('base64');

    const insertUserInfoParams = [student_id, hashedPassword, nickname];

    const connection = await pool.getConnection(async (conn) => conn);

    const userIdResult = await userDao.insertUserInfo(
      connection,
      insertUserInfoParams
    );
    console.log(`추가된 회원 index : ${userIdResult[0].insertId}`);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - createUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (student_id, password) {
  try {
    // 학번 여부 확인
    const userRows = await userProvider.userLoginCheck(student_id);
    if (userRows.length < 1) {
      logger.info(
        `Login Fail: [student_id NOT EXIST](student_id=${student_id})`
      );
      return errResponse(baseResponse.SIGNIN_STUDENT_ID_WRONG);
    }

    const userStat = userRows[0].stat;

    // 계정 상태 확인
    if (userStat === 'D') {
      logger.info(`Login Fail: [Withdrawal Account](student_id=${student_id})`);
      return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
    }

    const selectedUserPassword = userRows[0].pw;
    const reqHashedPassword = await crypto
      .createHash('sha512')
      .update(password)
      .digest('base64');

    if (selectedUserPassword !== reqHashedPassword) {
      logger.info(`Login Fail: [Password Wrong](student_id=${student_id})`);
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    //토큰 생성 Service
    let accessToken = await jwt.sign(
      {
        user_id: userRows[0].user_idx,
      }, // 토큰의 내용(payload)
      process.env.JWTSECRET, // 비밀키
      {
        expiresIn: '14d',
        subject: 'user',
      } // 유효 기간 14일
    );

    //TODO: 다중 다바이스 로그인을 위해 동일한 refreshToken발급 필요.
    let refreshToken = await jwt.sign(
      {}, // 토큰의 내용(payload)
      process.env.JWTSECRET, // 비밀키
      {
        expiresIn: '93d',
        subject: 'user',
      } // 유효 기간 93일
    );

    //refreshToken DB저장
    const connection = await pool.getConnection(async (conn) => conn);
    await userDao.updateUserToken(
      connection,
      userRows[0].user_idx,
      refreshToken
    );
    connection.release();

    return response(baseResponse.SUCCESS, {
      user_id: userRows[0].user_idx,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (err) {
    logger.error(
      `App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(
        err
      )}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.editUser = async function (id, nickname) {
  try {
    console.log(id);
    const connection = await pool.getConnection(async (conn) => conn);
    const editUserResult = await userDao.updateUserInfo(
      connection,
      id,
      nickname
    );
    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - editUser Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
