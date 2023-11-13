async function selectStoreListByCategory(connection, category) {
  const query = `
  SELECT Store.store_idx AS store_index, Store.name AS store_name, Store.address
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

async function selectStoreDetail(connection, storeId) {
  const query = `
  SELECT Store.name as store_name, Store.store_idx, Store.time as store_time, Store.telephone as store_tel
  FROM Store
  WHERE Store.store_idx = ? ;
  `;
  const [resultRows] = await connection.query(query, storeId);
  return resultRows;
}

async function selectMenusByStore(connection, storeId) {
  const query = `
  SELECT Menu.menu_idx as menu_index, Menu.menu_name, Menu.price as menu_price, Menu.likes AS menu_likes
  FROM Menu
  WHERE Menu.store_idx = ? 
  ORDER BY Menu.likes DESC ;
  `;
  const [resultRows] = await connection.query(query, storeId);
  return resultRows;
}

async function checkUserLikeMenu(connection, userId, menuId) {
  const query = `
  SELECT * 
  FROM UserLikedMenu
  WHERE user_idx = ? 
    And menu_idx = ? ;
  `;

  const [resultRows] = await connection.query(query, [userId, menuId]);
  if (resultRows.length > 0) {
    return true;
  }
  return false;
}

module.exports = {
  selectStoreListByCategory,
  selectBestMenu,
  selectStoreDetail,
  selectMenusByStore,
  checkUserLikeMenu,
};
