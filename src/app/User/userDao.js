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

async function selectLoginUserStudentId(connection, student_id) {
  const selectLoginUserStudentIdQuery = `
                 SELECT user_idx, pw, stat
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

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE UserInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}

module.exports = {
  selectUserStudentId,
  selectLoginUserStudentId,
  insertUserInfo,
  updateUserInfo,
};
