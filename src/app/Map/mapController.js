const mapProvider = require('../Map/mapProvider');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

/**
 * API No. 1
 * API Name : 지도 전체 식당 목록 조회 API
 * [GET] /app/map/store
 */
exports.getStores = async function (req, res) {
  const storeListResult = await mapProvider.retrieveStores();
  return res.send(response(baseResponse.SUCCESS, storeListResult));
};

/**
 * API No. 2
 * API Name : 지도 음식점 목록 조회 API
 * [GET] /app/map/restaurant
 */
exports.getRestaurants = async function (req, res) {
  const restaurantListResult = await mapProvider.retrieveRestaurants();
  return res.send(response(baseResponse.SUCCESS, restaurantListResult));
};

/**
 * API No. 3
 * API Name : 지도 음식점 목록 조회 API
 * [GET] /app/map/cafe
 */
exports.getCafes = async function (req, res) {
  const cafeListResult = await mapProvider.retrieveCafes();
  return res.send(response(baseResponse.SUCCESS, cafeListResult));
};