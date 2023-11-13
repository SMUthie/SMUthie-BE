// 이메일로 회원 조회
async function selectUserStudentId(connection, student_id) {
  const selectUserStudentIdQuery = `
                SELECT user_idx
                FROM User 
                WHERE student_id = ?;
                `;
  const [studentIdRows] = await connection.query(
    selectUserStudentIdQuery,
    student_id
  );
  return studentIdRows;
}

// 학번으로 회원 조회
async function selectUserAndStatByStudentId(connection, student_id) {
  const selectUserStudentIdQuery = `
                SELECT user_idx, stat
                FROM User 
                WHERE student_id = ?;
                `;
  const [studentIdRows] = await connection.query(
    selectUserStudentIdQuery,
    student_id
  );
  return studentIdRows;
}

// 인덱스로 회원 조회
async function selectUserAndStatByUserIdx(connection, userIdx) {
  const selectUserStudentIdQuery = `
                SELECT user_idx, stat
                FROM User 
                WHERE user_idx = ?;
                `;
  const [studentIdRows] = await connection.query(
    selectUserStudentIdQuery,
    userIdx
  );
  return studentIdRows;
}

// 인덱스로 회원 조회
async function selectUserAndStatByNickname(connection, nickname) {
  const selectUserStudentIdQuery = `
                SELECT user_idx, stat
                FROM User 
                WHERE nickname = ?;
                `;
  const [studentIdRows] = await connection.query(
    selectUserStudentIdQuery,
    nickname
  );
  return studentIdRows;
}

async function countNickname(connection, nickname) {
  const countNicknameQuery = `
  SELECT COUNT(User.nickname) AS number
  FROM User
  WHERE User.nickname = BINARY(?)`;

  const [countNicknameNumber] = await connection.query(
    countNicknameQuery,
    nickname
  );
  return countNicknameNumber[0].number;
}

async function countSchoolId(connection, schoolId) {
  const countSchoolIdQuery = `
  SELECT COUNT(User.student_id) AS number
  FROM User
  WHERE User.student_id = BINARY(?)`;

  const [countSchoolIdNumber] = await connection.query(
    countSchoolIdQuery,
    schoolId
  );
  return countSchoolIdNumber[0].number;
}

async function selectLoginUserStudentId(connection, student_id) {
  const selectLoginUserStudentIdQuery = `
                 SELECT user_idx, pw, stat, token
                 FROM User
                 WHERE student_id=?;
                 `;
  const [loginUserRow] = await connection.query(
    selectLoginUserStudentIdQuery,
    student_id
  );
  return loginUserRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(student_id, pw, nickname, created_at, updated_at, stat)
        VALUES (?, ?, ?, NOW(), NOW(), 'A');
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

async function updateUserNickname(connection, user_idx, newNickname) {
  const updateUserQuery = `
  UPDATE User 
  SET nickname = ?
  WHERE user_idx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [
    newNickname,
    user_idx,
  ]);
  return updateUserRow[0];
}

async function setUserStateDisable(connection, user_idx) {
  const updateUserQuery = `
  UPDATE User 
  SET stat = 'D'
  WHERE user_idx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, user_idx);
  return updateUserRow[0];
}

async function updateUserPassword(connection, id, password) {
  const updateUserQuery = `
  UPDATE User
  SET pw = ?
  WHERE user_idx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [password, id]);
  return updateUserRow[0];
}

async function updateUserToken(connection, user_idx, token) {
  const updateUserTokenQuery = `
  UPDATE User
  SET token = ?
  WHERE user_idx = ?;`;
  const updateUserTokenRow = await connection.query(updateUserTokenQuery, [
    token,
    user_idx,
  ]);
  return updateUserTokenRow[0];
}

async function selectRefreshTokenUseUserIdx(connection, userIdx) {
  const selectUserRefreshTokenQuery = `
                SELECT user_idx, token
                FROM User 
                WHERE user_idx = ?;
                `;
  const [userRTokenInfoRows] = await connection.query(
    selectUserRefreshTokenQuery,
    userIdx
  );
  return userRTokenInfoRows;
}

async function selectUserPoint(connection, userIdx) {
  const selectUserRefreshTokenQuery = `
                SELECT user_idx, level_times
                FROM User 
                WHERE user_idx = ?;
                `;
  const [userRTokenInfoRows] = await connection.query(
    selectUserRefreshTokenQuery,
    userIdx
  );
  return userRTokenInfoRows;
}

async function selectUserLikedReview(connection, userIdx) {
  const selectUserLikedReviewQuery = `
                SELECT Review.review_idx, Review.store_idx, Store.name AS store_name, Review.content, Review.likes, Review.unlikes, Review.image_url
                FROM Review

                  JOIN UserLikedReview
                  ON Review.review_idx = UserLikedReview.review_idx

                  JOIN Store
                  ON Review.store_idx = Store.store_idx

                WHERE UserLikedReview.user_idx = ?;
                `;
  const [userUserLikedReviewRows] = await connection.query(
    selectUserLikedReviewQuery,
    userIdx
  );
  return userUserLikedReviewRows;
}

async function selectUserWrittenReview(connection, userIdx) {
  const selectUserWrittenReviewQuery = `
                SELECT Review.review_idx, Review.store_idx, Store.name AS store_name, Review.content, Review.likes, Review.unlikes, Review.image_url
                FROM Review
                  JOIN Store
                  ON Review.store_idx = Store.store_idx
                WHERE Review.user_idx = ?;
                `;
  const [userUserWrittenReviewRows] = await connection.query(
    selectUserWrittenReviewQuery,
    userIdx
  );
  return userUserWrittenReviewRows;
}

async function selectMenusByReview(connection, review_idx) {
  const menusByReviewQuery = `
                SELECT Menu.menu_idx, Menu.menu_name
                FROM Menu 
                  JOIN  ReviewMenu
                  ON ReviewMenu.menu_idx = Menu.menu_idx
                WHERE ReviewMenu.review_idx = ?;
                `;
  const [MenusByReview] = await connection.query(
    menusByReviewQuery,
    review_idx
  );
  return MenusByReview;
}

module.exports = {
  selectUserStudentId,
  selectUserAndStatByStudentId,
  selectUserAndStatByUserIdx,
  selectLoginUserStudentId,
  selectUserAndStatByNickname,
  countNickname,
  countSchoolId,
  insertUserInfo,
  updateUserNickname,
  setUserStateDisable,
  updateUserToken,
  updateUserPassword,
  selectRefreshTokenUseUserIdx,
  selectUserPoint,
  selectUserLikedReview,
  selectUserWrittenReview,
  selectMenusByReview,
};
