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
      stores[i].menu_index = 0;
      stores[i].menu_name = '입력예정';
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

exports.getBoardCategory = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const resultA = await findStoreAndBestMenuByType(connection, 'A');
  const resultR = await findStoreAndBestMenuByType(connection, 'R');
  resultR.push(...resultA);
  for (let i = 0; i < resultR.length; i++) {
    resultR[i] = checkStoreLocation(resultR[i]);
    resultR[i]['isCafe'] = false;
  }

  const resultC = await findStoreAndBestMenuByType(connection, 'C');
  for (let i = 0; i < resultC.length; i++) {
    resultC[i] = checkStoreLocation(resultC[i]);
    resultC[i]['isCafe'] = true;
  }

  resultR.push(...resultC);
  connection.release();
  return response(baseResponseStatus.SUCCESS, resultR);
};

exports.getStoreInfo = async function (userId, storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const res = await getStoreAndMenuInfo(connection, userId, storeId);
  connection.release();
  return response(baseResponseStatus.SUCCESS, res);
};
