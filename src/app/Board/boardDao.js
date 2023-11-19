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

async function selectCafeCategory(connection, cafeIndex) {
  const query = `
  SELECT Store.cafe_hashtag as cafe_tag
  FROM Store 
  WHERE Store.store_idx = ?
  `;
  const [resultRows] = await connection.query(query, cafeIndex);
  return resultRows;
}

async function selectAllReviewImageByStore(connection, storeIndex) {
  const query = `
  SELECT Review.image_url
  FROM Review 
  WHERE Review.store_idx = ? 
  ORDER BY created_at DESC;
  `;
  const [resultRows] = await connection.query(query, storeIndex);
  return resultRows;
}

async function selectStoreDetail(connection, storeId) {
  const query = `
  SELECT Store.name as store_name, Store.store_idx, Store.time as store_time, Store.telephone as store_tel, Store.view_count as store_views
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

async function getMenuLikes(connection, menuId) {
  const query = `
  SELECT Menu.likes
  FROM Menu
  WHERE menu_idx = ?;
  `;

  const [resultRows] = await connection.query(query, menuId);
  return resultRows[0].likes;
}

async function setMenuLikes(connection, menuId, newLikes) {
  const query = `
  UPDATE Menu
  SET Menu.likes = ?
  WHERE Menu.menu_idx = ?;
  `;

  const [resultRows] = await connection.query(query, [newLikes, menuId]);
  return;
}

async function getStoreViews(connection, storeId) {
  const query = `
  SELECT Store.view_count
  FROM Store
  WHERE Store.store_idx = ?;
  `;

  const [resultRows] = await connection.query(query, storeId);
  return resultRows[0].view_count;
}

async function setStoreViews(connection, storeId, newViews) {
  const query = `
  UPDATE Store
  SET Store.view_count = ?
  WHERE Store.store_idx = ?;
  `;

  const [resultRows] = await connection.query(query, [newViews, storeId]);
  return;
}

async function insertUserLikeMenu(connection, userId, menuId) {
  const query = `
  INSERT INTO 
    UserLikedMenu(user_idx, menu_idx) 
    VALUES (?, ?);
  `;

  const [resultRows] = await connection.query(query, [userId, menuId]);
  return;
}

async function deleteUserLikeMenu(connection, userId, menuId) {
  const query = `
  DELETE FROM UserLikedMenu
  WHERE user_idx = ? 
    And menu_idx = ? ;
  `;

  const [resultRows] = await connection.query(query, [userId, menuId]);
  return;
}

async function forceUpdateStoreViewsToZero(connection) {
  const query = `
  UPDATE Store
  SET view_count = 0
  WHERE 1 ;
  `;

  const [resultRows] = await connection.query(query);
  return;
}

module.exports = {
  selectStoreListByCategory,
  selectBestMenu,
  selectCafeCategory,
  selectAllReviewImageByStore,
  selectStoreDetail,
  selectMenusByStore,
  checkUserLikeMenu,
  getMenuLikes,
  setMenuLikes,
  getStoreViews,
  setStoreViews,
  insertUserLikeMenu,
  deleteUserLikeMenu,
  forceUpdateStoreViewsToZero,
};
