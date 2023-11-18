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
exports.retrieveReview = async function (reviewIdx, userIdx) { 
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewResult = await reviewDao.selectReview(connection, reviewIdx);
    const isLikedResult = await reviewDao.selectIsLiked(connection, reviewIdx, userIdx);
    const isUnlikedResult = await reviewDao.selectIsUnliked(connection, reviewIdx, userIdx);
    const result = reviewResult[0];
    const images = result['image_url'].split(',')

    result['isLiked'] = isLikedResult;
    result['isUnliked'] = isUnlikedResult;
    result['image_url'] = images;

    connection.release();
    return result;
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);   
    return errResponse(baseResponse.DB_ERROR); 
  }
}