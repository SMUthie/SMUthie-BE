const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const recommendationDao = require("./recommendationDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveRecommendation = async function (isUp, isRice, isSoup, isMeat, isSpicy) { 
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const recommendationListResult = await recommendationDao.selectRecommendationList(connection, isUp, isRice, isSoup, isMeat, isSpicy);
    connection.release();

    return recommendationListResult;  
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);   
    return errResponse(baseResponse.DB_ERROR); 
  }
}

