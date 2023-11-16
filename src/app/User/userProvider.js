const baseResponseStatus = require('../../../config/baseResponseStatus');
const { pool } = require('../../../config/database');
const { errResponse, response } = require('../../../config/response');
const { logger } = require('../../../config/winston');
const {
  saveAuthCode,
  getEmailAuthCode,
  finishEmailAuthCode,
} = require('../../../crawling/mealDb');
const { encrypt, decrypt } = require('../../../util/crypter');
const { renderAuthEmail } = require('../../../util/ejsRender');
const { sendEmailUseSchoolId } = require('../../../util/email');
const { verifyRToken, signAToken } = require('../../../util/jwtUtil');

const userDao = require('./userDao');
const userUtil = require('./userUtil');

const generateRandomCode = (digit) => {
  let randomNumberCode = '';
  for (let i = 0; i < digit; i++) {
    randomNumberCode += Math.floor(Math.random() * 10);
  }
  return randomNumberCode;
};

const generateAuthUrl = (schoolId, randomCode) => {
  //이메일 인증을 위한 링크 생성 -> 암호화 필수
  const AUTH_QUERY = `${schoolId}&&${randomCode}`;
  const CRYPTED_QUERY = encrypt(AUTH_QUERY, process.env.AUTH_QUERY_SECRET_KEY);
  const ENCODED_QUERY = encodeURIComponent(CRYPTED_QUERY);
  console.log('encoded query: ', ENCODED_QUERY);

  const LINK_DOMAIN =
    process.env.NODE_ENV == 'test'
      ? 'http://localhost:3000'
      : process.env.EMAIL_AUTH_DOMAIN;

  return `${LINK_DOMAIN}/auth/auth_email?code=${ENCODED_QUERY}`;
};

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

exports.checkNicknameExist = async function (new_nickname) {
  const conn = await pool.getConnection(async (conn) => conn);
  const nicknameNumber = await userDao.countNickname(conn, new_nickname);
  conn.release();
  if (nicknameNumber === 0) {
    return response(baseResponseStatus.SUCCESS);
  } else {
    return errResponse(baseResponseStatus.SIGNUP_REDUNDANT_NICKNAME);
  }
};

const checkSchoolIdExist = async function (new_school_id) {
  let isExist = false;
  const conn = await pool.getConnection(async (conn) => conn);
  const schoolId = await userDao.countSchoolId(conn, new_school_id);
  conn.release();
  if (schoolId > 0) {
    isExist = true;
  }
  return isExist;
};

exports.sendEmail = async function (schoolId) {
  // 1. 가입된 회원 차단
  const isSchoolIdExist = await checkSchoolIdExist(schoolId);
  if (isSchoolIdExist)
    return errResponse(baseResponseStatus.SIGNUP_REDUNDANT_STUDENT_ID);

  //이메일 인증을 위한 랜덤 코드 생성
  const AUTH_CODE = generateRandomCode(10);

  await saveAuthCode(schoolId, AUTH_CODE);

  //이메일 인증을 위한 링크 생성 -> 암호화 필수
  const AUTH_URL = generateAuthUrl(schoolId, AUTH_CODE);

  //이메일 보내기
  const AUTH_EMAIL_HTML = await renderAuthEmail(AUTH_URL); //보낼 이메일 내용을 랜더링하기
  sendEmailUseSchoolId(schoolId, '스무디 학생 인증', AUTH_EMAIL_HTML); // 해당 내용을 학번으로 이메일 보내기
  return response(baseResponseStatus.SUCCESS);
};

exports.authEmail = async function (code) {
  const DECODED_CODE = decodeURIComponent(code);
  const AUTH_QUERY_ARRAY = decrypt(
    DECODED_CODE,
    process.env.AUTH_QUERY_SECRET_KEY
  ).split('&&');
  const URL_SCHOOL_ID = AUTH_QUERY_ARRAY[0];
  const URL_AUTH_CODE = AUTH_QUERY_ARRAY[1];

  const DB_AUTH_CODE = await getEmailAuthCode(URL_SCHOOL_ID);
  console.log(DB_AUTH_CODE);
  console.log(URL_AUTH_CODE);

  if (!DB_AUTH_CODE) {
    console.log('Email Auth Error: 사용자 존재하지 않음');
    return "<script>alert('시간이 지나 이메일 인증이 실패했습니다. 인증 링크를 다시 한 번 확인하세요.');</script>";
  }

  if (DB_AUTH_CODE == URL_AUTH_CODE) {
    await finishEmailAuthCode(URL_SCHOOL_ID);
    return "<script>alert('이메일 인증이 완료되었습니다!');</script>";
  } else {
    return "<script>alert('이메일 인증이 실패했습니다. 인증 링크를 다시 한 번 확인하세요.');</script>";
  }
};

exports.checkAuthStatus = async function (schoolId) {
  const authCode = await getEmailAuthCode(schoolId);
  if (!authCode) {
    return errResponse(baseResponseStatus.SIGNIN_INACTIVE_ACCOUNT);
  }
  if (authCode == 'finish') {
    return response(baseResponseStatus.SUCCESS);
  }
  return errResponse(baseResponseStatus.SIGNIN_INACTIVE_ACCOUNT);
};

exports.userStatCheckBySchoolId = async function (student_id) {
  const connection = await pool.getConnection(async (conn) => conn);
  const studentIdCheckResult = await userDao.selectUserAndStatByStudentId(
    connection,
    student_id
  );
  connection.release();

  return studentIdCheckResult;
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

exports.getUserLevel = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userPointQuery = await userDao.selectUserPoint(connection, userIdx);
  connection.release();

  const userPoint = userPointQuery[0].level_times;

  //TODO: 마이페이지 등급 조회

  return response(baseResponseStatus.SUCCESS, {
    times: userPoint,
  });
};

exports.getUserLikedReview = async function (userIndex) {
  const conn = await pool.getConnection(async (conn) => conn);
  const userLikedReviews = [];

  //리뷰 내용 가져오기
  const likedReviewsContent = await userDao.selectUserLikedReview(
    conn,
    userIndex
  );

  for (let i = 0; i < likedReviewsContent.length; i++) {
    const reviewContent = likedReviewsContent[i];

    //해당 리뷰 메뉴 가져오기
    const menusInReview = await userUtil.collectMenusList(conn, reviewContent);

    // 반환할 리뷰글 형식 만들기
    const reviewDetail = await userUtil.formatReviewDate(
      reviewContent,
      menusInReview
    );

    userLikedReviews.push(reviewDetail);
  }
  conn.release();

  return response(baseResponseStatus.SUCCESS, {
    reviews: userLikedReviews,
  });
};

exports.getUserWrittenReview = async function (userIndex) {
  const conn = await pool.getConnection(async (conn) => conn);
  const userWrittenReviews = [];

  //리뷰 내용 가져오기
  const writtenReviewsContent = await userDao.selectUserWrittenReview(
    conn,
    userIndex
  );

  for (let i = 0; i < writtenReviewsContent.length; i++) {
    const reviewContent = writtenReviewsContent[i];

    //해당 리뷰 메뉴 가져오기
    const menusInReview = await userUtil.collectMenusList(conn, reviewContent);

    // 반환할 리뷰글 형식 만들기
    const reviewDetail = await userUtil.formatReviewDate(
      reviewContent,
      menusInReview
    );

    userWrittenReviews.push(reviewDetail);
  }
  conn.release();

  return response(baseResponseStatus.SUCCESS, {
    reviews: userWrittenReviews,
  });
};
