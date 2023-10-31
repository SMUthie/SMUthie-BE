const { response } = require('express');
const { pool } = require('../../../config/database');

const boardDao = require('./boardDao');
const baseResponseStatus = require('../../../config/baseResponseStatus');

exports.getBoardCategoryList = async function () {
  const connection = await pool.getConnection(async (conn) => conn);

  // 모든 식당 찾기
  const allRestaurantResult = await boardDao.selectRestaurantList(connection);

  // 각 식당별 베스트 메뉴 찾기
  for (let index = 0; index < allRestaurantResult.length; index++) {
    const restaurantRow = allRestaurantResult[index].;
    
  }

  // 식당-베스트 메뉴 데이터 합치기

  // 반환하기

  connection.release();

  return response(baseResponseStatus.SUCCESS, boardCategoryResult);
};
