// 1. 가게의 리뷰글 전체 조회 
async function selectReviewList(connection, storeIdx) {
  const selectReviewListQuery = `
    SELECT Review.review_idx, Review.store_idx, Review.content, Review.likes, Review.unlikes, ReviewMenu.menu_idx, menu_name, created_at
    FROM SMUthie.Review, SMUthie.ReviewMenu, SMUthie.Menu
    WHERE Review.store_idx = ?
      AND ReviewMenu.review_idx = Review.review_idx
      AND ReviewMenu.menu_idx = Menu.menu_idx;
    `;
  const [reviewRows] = await connection.query(selectReviewListQuery, storeIdx);
  return reviewRows;
}


// 2. 가게의 리뷰글 생성 (Create)
async function insertReview(connection, insertReviewParams) {
  const insertReviewQuery = `
    INSERT INTO Review(store_idx, user_idx, content, image_url) VALUES (?, ?, ?, ?);
  `;

  const [insertReviewRow] = await connection.query(insertReviewQuery, insertReviewParams);
  
  console.log(insertReviewParams, insertReviewRow.insertId);
  return insertReviewRow.insertId;
}

// 해시태그 메뉴명 찾기
async function insertReviewMenu(connection, menuName) {
  const selectReviewMenuQuery = `
    SELECT menu_idx, menu_name
    FROM SMUthie.Menu, SMUthie.Store
    WHERE Menu.store_idx = Store.store_idx
      AND menu_name = ?;
  `;

  const [menuRows] = await connection.query(selectReviewMenuQuery, menuName);
  if (menuRows.length > 0) {
    const menuIdx = menuRows[0].menu_idx;
    return menuIdx;
  }

  return null; // 메뉴가 없을 경우 null 반환
}

// 3. 리뷰글 상세 조회 
async function selectReview(connection, reviewIdx) {
  const selectReviewQuery = `
    SELECT Review.review_idx, User.user_idx, nickname, ReviewMenu.menu_idx, menu_name, Review.store_idx, Store.name, content, Review.likes, Review.unlikes, Review.image_url, Review.created_at
    FROM SMUthie.Review, SMUthie.User, SMUthie.ReviewMenu, SMUthie.Menu, SMUthie.Store
    WHERE Review.review_idx = ?
      AND Review.user_idx = User.user_idx
      AND Store.store_idx = Review.store_idx
      AND ReviewMenu.review_idx = Review.review_idx
      AND ReviewMenu.menu_idx = Menu.menu_idx;
    `;
  const [review] = await connection.query(selectReviewQuery, reviewIdx);
  return review;
}

// 4. 가게의 리뷰글 수정 (Update)
async function updateReview(connection, content, reviewIdx) {
  const updateReviewParams = [content, reviewIdx];
  const updateReviewQuery = `
    UPDATE SMUthie.Review
    SET content = ?
    WHERE review_idx = ?;
  `;

  const [updateReviewRow] = await connection.query(updateReviewQuery, updateReviewParams);
  
  console.log(updateReviewParams);

  return updateReviewRow;
}

// 5. 가게의 리뷰글 삭제 (Delete)
async function deleteReview(connection, reviewIdx) {
  const deleteReviewQuery = `
    DELETE FROM SMUthie.Review
    WHERE review_idx = ?;
  `;

  const [deleteReviewRow] = await connection.query(deleteReviewQuery, reviewIdx);

  return deleteReviewRow;
}

// review 작성자 찾기 
async function selectReviewWriter(connection, reviewIdx) {
  const selectReviewWriterQuery = `
    SELECT user_idx
    FROM SMUthie.Review
    WHERE review_idx = ?;
  `;

  const [writerRow] = await connection.query(selectReviewWriterQuery, reviewIdx);

  if (writerRow.length > 0) {
    const userIdx = writerRow[0].user_idx;
    return userIdx;
  }

  return null; // 작성자가 없을 경우 null 반환
}

// 내가 좋아요 눌렀는지 확인
async function selectIsLiked(connection, reviewIdx, userIdx) {
  const selectIsLikedQuery = `
    SELECT user_idx, review_idx
    FROM SMUthie.UserLikedReview
    WHERE review_idx = ? 
      AND user_idx = ?;
  `;

  const [likeRow] = await connection.query(selectIsLikedQuery, [reviewIdx, userIdx]);

  if (likeRow.length > 0) {
    return true;
  }

  return false; // 좋아요를 하지 않았을 경우 false 반환
}

// 내가 좋아요 눌렀는지 확인
async function selectIsUnliked(connection, reviewIdx, userIdx) {
  const selectIsUnlikedQuery = `
    SELECT user_idx, review_idx
    FROM SMUthie.UserUnlikedReview
    WHERE review_idx = ? 
      AND user_idx = ?;
  `;

  const [unlikeRow] = await connection.query(selectIsUnlikedQuery, [reviewIdx, userIdx]);

  if (unlikeRow.length > 0) {
    return true;
  }

  return false; // 좋아요를 하지 않았을 경우 false 반환
}

module.exports = {
  selectReviewList,
  insertReview,
  insertReviewMenu,
  selectReview,
  updateReview,
  deleteReview,
  selectReviewWriter,
  selectIsLiked,
  selectIsUnliked
};