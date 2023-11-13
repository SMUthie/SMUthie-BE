// 지도 전체 식당 조회 
async function selectStores(connection) {
  const selectStoresQuery = `
                SELECT store_idx, latitude, longitude, name, telephone, time, mark_image
                FROM SMUthie.Store;
                `;
  const [storeRows] = await connection.query(selectStoresQuery);
  return storeRows;
}

module.exports = {
  selectStores,
};

// 지도 음식점 조회 
async function selectRestaurants(connection) {
  const selectRestaurantsQuery = `
                SELECT store_idx, latitude, longitude, name, telephone, time, mark_image
                FROM SMUthie.Store
                WHERE category = "R"
                  OR category = "A";
                `;
  const [restaurantRows] = await connection.query(selectRestaurantsQuery);
  return restaurantRows;
}

// 지도 카페 조회 
async function selectCafes(connection) {
  const selectCafesQuery = `
                SELECT store_idx, latitude, longitude, name, telephone, time, mark_image
                FROM SMUthie.Store
                WHERE category = "C";
                `;
  const [cafeRows] = await connection.query(selectCafesQuery);
  return cafeRows;
}

module.exports = {
  selectStores,
  selectRestaurants,
  selectCafes,
};