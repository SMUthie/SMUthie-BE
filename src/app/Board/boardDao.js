async function selectStoreListByCategory(connection, category) {
  const query = `
  SELECT Store.store_idx AS store_index, Store.name AS store_name 
  FROM Store 
  WHERE Store.category = ? ;
  `;
  const [resultRows] = await connection.query(query, category);
  return resultRows;
}

async function selectBestMenu(connection, restaurantIdx) {
  const query = `
  SELECT Menu.menu_idx AS menu_index, Menu.menu_name
  FROM Menu 
  WHERE Menu.store_idx = ?
  ORDER BY Menu.likes DESC
  LIMIT 1;;
  `;
  const [resultRows] = await connection.query(query, restaurantIdx);
  return resultRows;
}

module.exports = {
  selectStoreListByCategory,
  selectBestMenu,
};
