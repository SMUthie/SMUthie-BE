const baseResponseStatus = require('../../../config/baseResponseStatus');
const { pool } = require('../../../config/database');
const { response } = require('../../../config/response');
const {
  checkUserLikeMenu,
  insertUserLikeMenu,
  deleteUserLikeMenu,
} = require('./boardDao');

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
  connection.release();

  return response(baseResponseStatus.SUCCESS, result);
};
