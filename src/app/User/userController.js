const userProvider = require('../../app/User/userProvider');
const userService = require('../../app/User/userService');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

const regexEmail = require('regex-email');
const { emit } = require('nodemon');
const baseResponseStatus = require('../../../config/baseResponseStatus');

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
// exports.getTest = async function (req, res) {
//     return res.send(response(baseResponse.SUCCESS))
// }

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/user/register
 * Body: student_id, password, nickname
 */
exports.postUsers = async function (req, res) {
  const { student_id, password, nickname } = req.body;

  // 학번 체크
  if (!student_id)
    return res.send(response(baseResponse.SIGNUP_STUDENT_ID_EMPTY));
  if (student_id.length > 15)
    return res.send(response(baseResponse.SIGNUP_STUDENT_ID_LENGTH));
  if (isNaN(student_id))
    return res.send(response(baseResponse.SIGNUP_STUDENT_ID_ERROR_TYPE));

  //비번 체크
  if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
  //TODO: 비번 길이 체크?

  //닉네임 체크
  if (!nickname) return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
  //TODO: 닉네임 길이 체크?
  //TODO: 닉네임 제약 체크?

  const signUpResponse = await userService.createUser(
    student_id,
    password,
    nickname
  );

  return res.send(signUpResponse);
};

/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/user/login
 * body : student_id, passsword
 */
exports.login = async function (req, res) {
  const { student_id, password } = req.body;

  // 학번 체크
  if (!student_id)
    return res.send(response(baseResponse.SIGNUP_STUDENT_ID_EMPTY));
  if (student_id.length > 15)
    return res.send(response(baseResponse.SIGNUP_STUDENT_ID_LENGTH));
  if (isNaN(student_id))
    return res.send(response(baseResponse.SIGNUP_STUDENT_ID_ERROR_TYPE));

  //비번 체크
  if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
  //TODO: 비번 길이 체크?

  const signInResponse = await userService.postSignIn(student_id, password);

  return res.send(signInResponse);
};

/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {
  // jwt - userId, path variable :userId
  if (userIdFromJWT != userId) {
    res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
  } else {
    if (!nickname)
      return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

    const editUserInfo = await userService.editUser(userId, nickname);
    return res.send(editUserInfo);
  }
};

exports.refreshJWT = async function (req, res) {
  const REFRESH_TOKEN = req.headers['x-refresh-token'];
  const USER_IDX = req.headers['x-user-idx'];
  if (!REFRESH_TOKEN) {
    return res.send(errResponse(baseResponse.TOKEN_EMPTY));
  } else if (!USER_IDX) {
    return res.send(errResponse(baseResponse.USER_IDX_EMPTY));
  }

  const newAccessToken = await userProvider.refreshTokenWithUserIdx(
    REFRESH_TOKEN,
    USER_IDX
  );
  return res.send(newAccessToken);
};

exports.test = function (req, res) {
  const userIdxFromJWT = req.user_idx;
  console.log(userIdxFromJWT);
  return res.send(
    response(baseResponseStatus.SUCCESS, {
      user_idx: userIdxFromJWT,
    })
  );
};
