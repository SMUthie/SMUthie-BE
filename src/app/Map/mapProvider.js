const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const mapDao = require("./mapDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveStores = async function () { 
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const storeListResult = await mapDao.selectStores(connection);
    connection.release();

    return storeListResult;  
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);   
    return errResponse(baseResponse.DB_ERROR); 
  }
}

exports.retrieveRestaurants = async function () { 
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const restaurantListResult = await mapDao.selectRestaurants(connection);
    connection.release();

    return restaurantListResult;  
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);   
    return errResponse(baseResponse.DB_ERROR); 
  }
}


