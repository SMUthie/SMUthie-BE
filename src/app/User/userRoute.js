module.exports = function (app) {
  const user = require('./userController');
  const jwtMiddleware = require('../../../config/jwtMiddleware');

  // 0. 테스트 API
  // app.get('/app/test', user.getTest)

  // 1. 유저 생성 (회원가입) API
  app.post('/app/user/register', user.postUsers);

  // 2. 로그인 하기 API (JWT 생성)
  app.post('/app/user/login', user.login);

  // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
  app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers);
};
