const mapProvider = require('../Map/mapProvider');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

/**
 * API No. 1
 * API Name : 지도 전체 식당 목록 조회 API
 * [GET] /app/map/store
 */
exports.getRestaurants = async function (req, res) {
  const storeListResult = await mapProvider.retrieveStores();
  return res.send(response(baseResponse.SUCCESS, storeListResult));
};
