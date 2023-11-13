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

const findStoreAndBestMenuByType = async function (conn, storeType) {
  //['A', 'R', 'C']
  const result = {};
  let stores = await boardDao.selectStoreListByCategory(conn, storeType);
  stores = await addBestMenuInStores(conn, stores);
  return stores;
};

const getStoreAndMenuInfo = async function (conn, userId, storeId) {
  let result = {};

  const storeDetail = await boardDao.selectStoreDetail(conn, storeId);
  result = storeDetail[0];

  const menuInfoList = await boardDao.selectMenusByStore(conn, storeId);
  for (let i = 0; i < menuInfoList.length; i++) {
    const isLiked = await boardDao.checkUserLikeMenu(conn, userId, storeId);
    menuInfoList[i]['is_liked'] = isLiked;
  }

  result['menus'] = menuInfoList;
  return result;
};

const checkStoreLocation = function (store) {
  if (store.address.indexOf('상명대학교') >= 0) {
    store['up'] = true;
  } else {
    store['up'] = false;
  }
  return store;
};

exports.getBoardRestaurant = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const resultA = await findStoreAndBestMenuByType(connection, 'A');
  const resultR = await findStoreAndBestMenuByType(connection, 'R');
  resultA.push(...resultR);
  for (let i = 0; i < resultA.length; i++) {
    resultA[i] = checkStoreLocation(resultA[i]);
  }
  connection.release();
  return response(baseResponseStatus.SUCCESS, resultA);
};

exports.getBoardCafeteria = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const result = await findStoreAndBestMenuByType(connection, 'C');
  connection.release();

  for (let i = 0; i < result.length; i++) {
    result[i] = checkStoreLocation(result[i]);
  }

  return response(baseResponseStatus.SUCCESS, result);
};

exports.getStoreInfo = async function (userId, storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const res = await getStoreAndMenuInfo(connection, userId, storeId);
  connection.release();
  return response(baseResponseStatus.SUCCESS, res);
};
