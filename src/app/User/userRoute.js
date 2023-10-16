const baseResponseStatus = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');

module.exports = function (app) {
  const user = require('./userController');
  const { verifyAToken } = require('../../../config/jwtVerify');

  // 0. 테스트 API
  // app.get('/app/test', user.getTest)

  // 1. 유저 생성 (회원가입) API
  app.post('/app/user/register', user.postUsers);

  // 2. 로그인 하기 API (JWT 생성)
  app.post('/app/user/login', user.login);

  //Access Token 인증 예제
  app.get('/app/user/test', verifyAToken, user.test);

  app.get('/app/user/info', verifyAToken, user.getUserLevel);

  app.get('/app/user/refresh', verifyAToken, user.refreshJWT);

  app.post('/app/user/tempPW', user.findPassword);

  app.patch('/app/user/changeName', verifyAToken, user.changeName);

  app.patch('/app/user/:userId', user.patchUsers);

  app.delete('/app/user', verifyAToken, user.deleteUser);
};
