const { pool } = require('../../../config/database');
const { errResponse } = require('../../../config/response');
const { logger } = require('../../../config/winston');
const baseResponse = require('../../../config/baseResponseStatus');
const homeDao = require('./homeDao');

// Provider: Read 비즈니스 로직 처리

exports.retrieveSchoolCafe = async function () {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const cafeListResult = await homeDao.selectSchoolCafe(connection);
    connection.release();

    return cafeListResult;
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.retrieveAndamiro = async function () {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const menuListResult = await homeDao.selectAndamiro(connection);
    connection.release();

    return menuListResult;
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

const addMealPrice = function (meal) {
  const PRICE_LIST = {
    천원: '1000원',
    자율한식: '6000원',
    푸드코트: '4000원~6000원',
  };
  for (let key in PRICE_LIST) {
    if (meal.mealName.indexOf(key) >= 0) {
      meal['price'] = PRICE_LIST[key];
      return meal;
    }
  }
  meal['price'] = 0;
  return meal;
};

exports.retrieveSchoolMeal = async function () {
  try {
    const menuListResult = await homeDao.selectWeeklyMeal();
    for (let i = 0; i < menuListResult.length; i++) {
      menuListResult[i] = addMealPrice(menuListResult[i]);
    }
    return menuListResult;
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
