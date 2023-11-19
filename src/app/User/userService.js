const { logger } = require('../../../config/winston');
const { pool } = require('../../../config/database');
const userProvider = require('./userProvider');
const userDao = require('./userDao');
const baseResponse = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { errResponse } = require('../../../config/response');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { signAToken, signRToken } = require('../../../util/jwtUtil');
const { sendEmailUseSchoolId } = require('../../../util/email');
const { rendernewPasswordEmail } = require('../../../util/ejsRender');

// Service: Create, Update, Delete 비즈니스 로직 처리
exports.createUser = async function (student_id, password, nickname) {
  try {
    // 학번 중복 확인
    const student_id_user = await userProvider.studentIdCheck(student_id);
    if (student_id_user.length > 0)
      return errResponse(baseResponse.SIGNUP_REDUNDANT_STUDENT_ID);

    // 비밀번호 암호화
    const hashedPassword = await crypto
      .createHash(process.env.PASSWORD_HASH)
      .update(password)
      .digest(process.env.PASSWORD_DIGEST);

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
      .createHash(process.env.PASSWORD_HASH)
      .update(password)
      .digest(process.env.PASSWORD_DIGEST);

    if (selectedUserPassword !== reqHashedPassword) {
      logger.info(`Login Fail: [Password Wrong](student_id=${student_id})`);
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    //토큰 생성 Service
    const NEW_A_TOKEN = signAToken(userRows[0].user_idx);
    const NEW_R_TOKEN = signRToken();

    //TODO: 다중 다바이스 로그인을 위해 동일한 refreshToken발급 필요.

    //refreshToken DB저장
    const connection = await pool.getConnection(async (conn) => conn);
    await userDao.updateUserToken(
      connection,
      userRows[0].user_idx,
      NEW_R_TOKEN
    );
    connection.release();

    return response(baseResponse.SUCCESS, {
      user_idx: userRows[0].user_idx,
      nickname: userRows[0].nickname,
      access_token: NEW_A_TOKEN,
      refresh_token: NEW_R_TOKEN,
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

exports.changePassword = async function (userId, oldPassword, newPassword) {
  try {
    var connection = await pool.getConnection(async (conn) => conn);
    const USER_INFO = await userDao.selectUserPassword(connection, userId);

    //1. check used oldPassword
    const selectedUserPassword = USER_INFO[0].pw;
    const reqHashedPassword = await crypto
      .createHash(process.env.PASSWORD_HASH)
      .update(oldPassword)
      .digest(process.env.PASSWORD_DIGEST);

    if (selectedUserPassword !== reqHashedPassword) {
      logger.info(`User Fail: [Old Password Wrong]`);
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    // 비밀번호 암호화
    const hashedPassword = await crypto
      .createHash(process.env.PASSWORD_HASH)
      .update(newPassword)
      .digest(process.env.PASSWORD_DIGEST);

    await userDao.updateUserPassword(connection, userId, hashedPassword);
    connection.release();

    //3. return
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - editUserNickname Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.findPassword = async function (schoolId) {
  try {
    const UserInfoBySchoolId = await userProvider.userStatCheckBySchoolId(
      schoolId
    );

    //조회된 사람이 없거나 탈퇴했으면
    if (UserInfoBySchoolId.length != 1 || UserInfoBySchoolId[0].stat == 'D') {
      return errResponse(baseResponse.USER_ID_NOT_MATCH);
    }

    const randomPassword = Math.random().toString().slice(2, 12);

    logger.warn(
      `Find Password - schoolId: ${schoolId}, newPassword: ${randomPassword}`
    );

    // 비밀번호 암호화
    const hashedPassword = await crypto
      .createHash(process.env.PASSWORD_HASH)
      .update(randomPassword)
      .digest(process.env.PASSWORD_DIGEST);

    const connection = await pool.getConnection(async (conn) => conn);
    const editPasswordResult = await userDao.updateUserPassword(
      connection,
      UserInfoBySchoolId[0].user_idx,
      hashedPassword
    );
    connection.release();

    const PW_EMAIL_HTML = await rendernewPasswordEmail(randomPassword);
    sendEmailUseSchoolId(
      schoolId,
      '임시 비밀번호가 생성되었습니다.',
      PW_EMAIL_HTML
    );

    //TODO: 임시 비번 반환 표시 삭제
    return response(baseResponse.SUCCESS, {
      message: `임시 비밀번호가 발급되었습니다. 테스트 전용: 임시 비번: ${randomPassword}.`,
    });
  } catch (err) {
    logger.error(`App - findPassword Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.editUserNickname = async function (userIdx, newNickname) {
  try {
    //1. check used nickname
    var connection = await pool.getConnection(async (conn) => conn);
    const usersInfoByIndex = await userDao.selectUserAndStatByNickname(
      connection,
      newNickname
    );
    connection.release();

    if (usersInfoByIndex.length >= 1) {
      return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);
    }

    //2. change nickname
    var connection = await pool.getConnection(async (conn) => conn);
    const changedUserInfo = await userDao.updateUserNickname(
      connection,
      userIdx,
      newNickname
    );
    connection.release();

    //3. return
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - editUserNickname Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.deleteUser = async function (userIdx) {
  try {
    var connection = await pool.getConnection(async (conn) => conn);
    await userDao.deleteUser(connection, userIdx);
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - deleteUser Service error\n: ${err.message}`);
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
