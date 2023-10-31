async function selectRestaurantList(connection) {
  const query = `
  SELECT Store.store_id as store_name, Store.name as store_name 
  FROM Store 
  WHERE Store.category = “R”;
  `;
  const [resultRows] = await connection.query(query);
  return resultRows;
}

module.exports = {
  selectRestaurantList,
};
