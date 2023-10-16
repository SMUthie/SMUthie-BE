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

module.exports = {
  selectUserStudentId,
  selectUserAndStatByStudentId,
  selectUserAndStatByUserIdx,
  selectLoginUserStudentId,
  selectUserAndStatByNickname,
  insertUserInfo,
  updateUserNickname,
  setUserStateDisable,
  updateUserToken,
  updateUserPassword,
  selectRefreshTokenUseUserIdx,
  selectUserPoint,
};
