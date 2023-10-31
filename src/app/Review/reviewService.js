const {pool} = require("../../../config/database");
const reviewDao = require("../Review/reviewDao");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const {logger} = require("../../../config/winston");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 가게 리뷰글 생성 
exports.createReview = async function(storeIdx, userIdx, content, imageUrl, menuTag) {
  try {
    const imageUrlString = imageUrl.join(',');
    const insertRevieParams = [storeIdx, userIdx, content, imageUrlString];
    const connection = await pool.getConnection(async (conn) => conn);
    const menuIdx = await reviewDao.insertReviewMenu(connection, menuTag)
    
    const temp = { isSuccess: false, code: 9999, message: '일치하는 메뉴 없음' };

    console.log('DB에서 받아온 인덱스', menuIdx);

    if (!menuIdx) {
      connection.release();
      return errResponse(temp);
    }

    console.log('메뉴 인덱스',menuIdx);

    const reviewIdx = await reviewDao.insertReview(connection, insertRevieParams);
    const insertReviewMenuQuery = `
      INSERT INTO ReviewMenu(review_idx, menu_idx) VALUES (?, ?);
    `;
    await connection.query(insertReviewMenuQuery, [reviewIdx, menuIdx]);

    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);   
    return errResponse(baseResponse.DB_ERROR); 
  }
}

// 가게 리뷰글 수정 
exports.updateReview = async function(content, reviewIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    
    await reviewDao.updateReview(connection, content, reviewIdx)
    
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);   
    return errResponse(baseResponse.DB_ERROR); 
  }
}

// 가게 리뷰글 삭제
exports.deleteReview = async function(reviewIdx) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    
    await reviewDao.deleteReview(connection, reviewIdx)
    
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);   
    return errResponse(baseResponse.DB_ERROR); 
  }
}