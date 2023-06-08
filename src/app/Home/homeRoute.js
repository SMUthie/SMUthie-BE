module.exports = function (app) {
  const home = require('./homeController');

  // 1. 교내 카페 정보 조회 API
  app.get('/app/home/cafe', home.getSchoolCafe);
};
