const { pool } = require('../../../config/database');

const boardDao = require('./boardDao');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');

const addBestMenuInStores = async function (conn, stores) {
  for (let i = 0; i < stores.length; i++) {
    const storeIndex = stores[i].store_index;
    const bestMenuResult = await boardDao.selectBestMenu(conn, storeIndex);
    if (bestMenuResult.length != 0) {
      stores[i].menu_index = bestMenuResult[0].menu_index;
      stores[i].menu_name = bestMenuResult[0].menu_name;
    } else {
      stores[i].menu_index = '없음';
      stores[i].menu_name = '없음';
    }
  }
  return stores;
};

const findStoreAndBestMenu = async function (conn) {
  const result = {};
  storeType = ['A', 'R', 'C'];
  for (let i = 0; i < storeType.length; i++) {
    const type = storeType[i];
    let stores = await boardDao.selectStoreListByCategory(conn, type);
    stores = await addBestMenuInStores(conn, stores);
    result[type] = stores;
  }
  return result;
};

exports.getBoardCategoryList = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const res = await findStoreAndBestMenu(connection);
  connection.release();
  return response(baseResponseStatus.SUCCESS, res);
};
