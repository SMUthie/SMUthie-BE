const { getSchoolMeal } = require('../../../crawling/mealDb');

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
                WHERE name = "안다미로" 
                  AND category = "A";
                `;
  const [menuRows] = await connection.query(selectAndamiroQuery);
  return menuRows;
}

async function selectWeeklyMeal() {
  return await getSchoolMeal();
}

module.exports = {
  selectSchoolCafe,
  selectAndamiro,
  selectWeeklyMeal,
};
