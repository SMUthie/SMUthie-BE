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

// 안다미로 정보 조회
async function selectAndamiro(connection) {
  const selectAndamiroQuery = `
                SELECT menu_name, price, likes, comment, image_url
                FROM Menu
                WHERE store_idx = 1;
                `;
  const [menuRows] = await connection.query(selectAndamiroQuery);
  return menuRows;
}

module.exports = {
  selectSchoolCafe,
  selectAndamiro,

};
