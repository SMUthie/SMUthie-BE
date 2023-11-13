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