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
  return res.send(response(baseResponse.SUCCESS, cafeListResult));
};
