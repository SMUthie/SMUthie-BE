// 추천 메뉴 조회 
async function selectRecommendationList(connection, isUp, isRice, isSoup, isMeat, isSpicy) {
  let selectRecommendationListQuery = `
                SELECT Store.name, Menu.menu_name, Menu.likes
                FROM SMUthie.Store, SMUthie.Menu 
                WHERE Store.store_idx = Menu.store_idx
                ORDER BY Menu.likes DESC;
                `;

  const params = [];

  if(isUp != -1) {
    selectRecommendationListQuery +=  ` AND is_up = ?`;
    params.push(isUp);
  }
  if(isRice != -1) {
    selectRecommendationListQuery +=  ` AND is_rice = ?`;
    params.push(isRice);
  }
  if(isSoup != -1) {
    selectRecommendationListQuery +=  ` AND is_soup = ?`;
    params.push(isSoup);
  }
  if(isMeat != -1) {
    selectRecommendationListQuery +=  ` AND is_meat = ?`;
    params.push(isMeat);
  }
  if(isSpicy != -1) { 
    selectRecommendationListQuery +=  ` AND is_spicy = ?`;
    params.push(isSpicy);
  }

  // console.log(selectRecommendationListQuery);
  const [recommendationRows] = await connection.query(selectRecommendationListQuery, params);
  return recommendationRows;
}

module.exports = {
  selectRecommendationList,

};