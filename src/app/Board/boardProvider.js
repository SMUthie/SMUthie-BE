const { pool } = require('../../../config/database');

const boardDao = require('./boardDao');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const { response } = require('../../../config/response');
const { addStoreViews } = require('./boardService');

const addBestMenuInStore = async function (conn, store, storeType) {
  const storeIndex = store.store_index;
  store.menu_index = 0;
  store.menu_name = '입력예정';
  if (storeType == 'C') {
    const cafeCategory = await boardDao.selectCafeCategory(conn, storeIndex);
    if (cafeCategory.length != 0 && cafeCategory[0].cafe_tag) {
      store.menu_name = cafeCategory[0].cafe_tag;
    }
  } else {
    const bestMenuResult = await boardDao.selectBestMenu(conn, storeIndex);
    if (bestMenuResult.length != 0) {
      store.menu_index = bestMenuResult[0].menu_index;
      store.menu_name = bestMenuResult[0].menu_name;
    }
  }

  return store;
};

const getStoreImageList = async function (conn, storeId) {
  const returnImageUrlList = [];
  const allReviewImagesByStore = await boardDao.selectAllReviewImageByStore(
    conn,
    storeId
  );
  for (let i = 0; i < allReviewImagesByStore.length; i++) {
    const imageString = allReviewImagesByStore[i];
    if (!imageString || !imageString.image_url) continue;

    const imageList = imageString.image_url.split(',');
    for (let i = 0; i < imageList.length; i++) {
      const element = imageList[i];
      returnImageUrlList.push(element);
      if (returnImageUrlList.length >= 3) {
        return returnImageUrlList;
      }
    }
  }
  while (returnImageUrlList.length < 3) {
    const defaultImageUrl =
      'https://smuthie.s3.ap-northeast-2.amazonaws.com/default/base.jpeg';
    returnImageUrlList.push(defaultImageUrl);
  }
  return returnImageUrlList;
};

const findStoreAndBestMenuByType = async function (conn, storeType) {
  //['A', 'R', 'C']
  const result = {};
  let stores = await boardDao.selectStoreListByCategory(conn, storeType);

  for (let i = 0; i < stores.length; i++) {
    stores[i] = await addBestMenuInStore(conn, stores[i], storeType);
  }
  return stores;
};

const getStoreAndMenuInfo = async function (conn, userId, storeId) {
  let result = {};

  const storeDetail = await boardDao.selectStoreDetail(conn, storeId);
  result = storeDetail[0];

  const menuInfoList = await boardDao.selectMenusByStore(conn, storeId);
  for (let i = 0; i < menuInfoList.length; i++) {
    const nowMenu = menuInfoList[i];
    const isLiked = await boardDao.checkUserLikeMenu(
      conn,
      userId,
      nowMenu.menu_index
    );
    menuInfoList[i]['is_liked'] = isLiked;
  }

  result['menus'] = menuInfoList;
  result['images'] = await getStoreImageList(conn, storeId);
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
  await addStoreViews(connection, storeId);
  connection.release();
  return response(baseResponseStatus.SUCCESS, res);
};
