// 교내 카페 정보 조회
async function selectSchoolCafe(connection) {
  const selectSchoolCafeQuery = `
                SELECT name, time, address
                FROM Store
                WHERE category = 'C' 
                  AND address like '%상명대학교%';
                `;
  const [cafeRows] = await connection.query(selectSchoolCafeQuery);
  return cafeRows;
}

module.exports = {
  selectSchoolCafe,

};
