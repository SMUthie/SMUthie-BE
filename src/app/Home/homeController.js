const homeProvider = require('../Home/homeProvider');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

/**
 * API No. 1
 * API Name : 교내 카페 정보 조회 API
 * [GET] /app/home/cafe
 */
exports.getSchoolCafe = async function (req, res) {
  const cafeListResult = await homeProvider.retrieveSchoolCafe();

  for(let i = 0; i < cafeListResult.length; i++) {
    const location = cafeListResult[i]['address'].split('상명대학교 ')[1];
    cafeListResult[i]['address'] = location;
  }
  
  return res.send(response(baseResponse.SUCCESS, cafeListResult));
};

/**
 * API No. 2
 * API Name : 안다미로 정보 조회 API
 * [GET] /app/home/andamiro
 */
exports.getAndamiro = async function (req, res) {
  const menuListResult = await homeProvider.retrieveAndamiro();
  return res.send(response(baseResponse.SUCCESS, menuListResult));
};

exports.getSchoolMeal = async function (req, res) {
  const mealListResult = await homeProvider.retrieveSchoolMeal();
  return res.send(response(baseResponse.SUCCESS, mealListResult));
};
