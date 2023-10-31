const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const reviewDao = require("./reviewDao");

// Provider: Read 비즈니스 로직 처리

// 가게 리뷰글 전체 조회
exports.retrieveReviewList = async function (storeIdx) { 
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewListResult = await reviewDao.selectReviewList(connection, storeIdx);

    connection.release();
    return reviewListResult;  
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);   
    return errResponse(baseResponse.DB_ERROR); 
  }
}

// 가게 리뷰글 상세 조회
exports.retrieveReview = async function (reviewIdx) { 
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewResult = await reviewDao.selectReview(connection, reviewIdx);

    connection.release();
    return reviewResult;  
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);   
    return errResponse(baseResponse.DB_ERROR); 
  }
}