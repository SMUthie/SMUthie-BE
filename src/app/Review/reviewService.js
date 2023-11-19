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
exports.updateReview = async function(content, reviewIdx, USER_IDX) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIdx = await reviewDao.selectReviewWriter(connection, reviewIdx);

    console.log(USER_IDX, userIdx);

    if (USER_IDX != userIdx) 
      return errResponse(baseResponse.USER_NOT_MATCH);
    
    await reviewDao.updateReview(connection, content, reviewIdx)
    
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);   
    return errResponse(baseResponse.DB_ERROR); 
  }
}

// 가게 리뷰글 삭제
exports.deleteReview = async function(reviewIdx, USER_IDX) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIdx = await reviewDao.selectReviewWriter(connection, reviewIdx);

    if (USER_IDX != userIdx) 
    return errResponse(baseResponse.USER_NOT_MATCH);
    
    await reviewDao.deleteReview(connection, reviewIdx)
    
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`[ERROR] ${err.message}`);   
    return errResponse(baseResponse.DB_ERROR); 
  }
}

// 리뷰글 좋아요 수 업데이트
const addReviewLikes = async function (connection, reviewIdx, nowLiked) {
  const nowLikes = await reviewDao.getReviewLikes(connection, reviewIdx);
  let diff = 0; 

  if (nowLiked) 
    diff = 1;
  else 
    diff = -1;

  await reviewDao.setReviewLikes(connection, reviewIdx, nowLikes + diff);
  return;
};

// 사용자가 리뷰글 좋아요 눌렀을 때
exports.likeReview = async function (userIdx, reviewIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const isLiked = await reviewDao.selectIsLiked(connection, reviewIdx, userIdx);
  const result = {
    nowStatus: false,
  };

  if (isLiked) {
    await reviewDao.deleteUserLikeReview(connection, userIdx, reviewIdx);
    result.nowStatus = false;
  } else {
    await reviewDao.insertUserLikeReview(connection, userIdx, reviewIdx);
    result.nowStatus = true;
  }
  await addReviewLikes(connection, reviewIdx, result.nowStatus);
  connection.release();

  return response(baseResponse.SUCCESS, result);
};

// 리뷰글 싫어요 수 업데이트
const addReviewUnlikes = async function (connection, reviewIdx, nowUnliked) {
  const nowUnlikes = await reviewDao.getReviewUnlikes(connection, reviewIdx);
  let diff = 0; 

  if (nowUnliked) 
    diff = 1;
  else 
    diff = -1;

  await reviewDao.setReviewUnlikes(connection, reviewIdx, nowUnlikes + diff);
  return;
};

// 사용자가 리뷰글 좋아요 눌렀을 때
exports.unlikeReview = async function (userIdx, reviewIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const isUnliked = await reviewDao.selectIsUnliked(connection, reviewIdx, userIdx);
  const result = {
    nowStatus: false,
  };

  if (isUnliked) {
    await reviewDao.deleteUserUnlikeReview(connection, userIdx, reviewIdx);
    result.nowStatus = false;
  } else {
    await reviewDao.insertUserUnlikeReview(connection, userIdx, reviewIdx);
    result.nowStatus = true;
  }
  await addReviewUnlikes(connection, reviewIdx, result.nowStatus);
  connection.release();

  return response(baseResponse.SUCCESS, result);
};