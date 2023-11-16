const baseResponseStatus = require('../../../config/baseResponseStatus');
const { pool } = require('../../../config/database');
const { response } = require('../../../config/response');
const {
  checkUserLikeMenu,
  insertUserLikeMenu,
  deleteUserLikeMenu,
  getMenuLikes,
  setMenuLikes,
} = require('./boardDao');

const addMenuLikes = async function (conn, menuId, nowLiked) {
  const nowLikes = await getMenuLikes(conn, menuId);
  let diff = 0;
  if (nowLiked) diff = 1;
  else diff = -1;
  await setMenuLikes(conn, menuId, nowLikes + diff);
  return;
};

exports.likeMenu = async function (userId, menuId) {
  const connection = await pool.getConnection(async (conn) => conn);

  //1. check like status
  const isLiked = await checkUserLikeMenu(connection, userId, menuId);

  //2. if liked: delete liked history and return
  //3. if liked: insert liked history and return
  const result = {
    nowStatus: false,
  };
  if (isLiked) {
    await deleteUserLikeMenu(connection, userId, menuId);
    result.nowStatus = false;
  } else {
    await insertUserLikeMenu(connection, userId, menuId);
    result.nowStatus = true;
  }
  await addMenuLikes(connection, menuId, result.nowStatus);
  connection.release();

  return response(baseResponseStatus.SUCCESS, result);
};
