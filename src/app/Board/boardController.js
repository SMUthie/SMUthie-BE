const { response } = require('express');
const {
  STORE_IDX_EMPTY,
  USER_IDX_EMPTY,
  MENU_IDX_EMPTY,
} = require('../../../config/baseResponseStatus');
const { errResponse } = require('../../../config/response');
const boardProvider = require('../../app/Board/boardProvider');
const boardService = require('../../app/Board/boardService');

// exports.getBoardCategory = async function (req, res) {
//   try {
//     const boardCategoryList = await boardProvider.getBoardCategoryList();
//     return res.send(boardCategoryList);
//   } catch (error) {
//     console.error(error);
//   }
// };

exports.getBoardCategory = async function (req, res) {
  try {
    const boardCategory = await boardProvider.getBoardCategory();
    return res.send(boardCategory);
  } catch (error) {
    console.error(error);
  }
};

exports.getStoreInfo = async function (req, res) {
  try {
    const STORE_ID = req.params.storeId;
    if (!STORE_ID) {
      return res.send(errResponse(STORE_IDX_EMPTY));
    }

    const USER_ID = req.user_idx;
    if (!USER_ID) {
      return res.send(errResponse(USER_IDX_EMPTY));
    }
    const storeInfo = await boardProvider.getStoreInfo(USER_ID, STORE_ID);
    return res.send(storeInfo);
  } catch (error) {
    console.error(error);
  }
};

exports.likeMenu = async function (req, res) {
  try {
    const MENU_ID = req.params.menuId;
    if (!MENU_ID) {
      return res.send(errResponse(MENU_IDX_EMPTY));
    }

    const USER_ID = req.user_idx;
    if (!USER_ID) {
      return res.send(errResponse(USER_IDX_EMPTY));
    }
    const likedMenu = await boardService.likeMenu(USER_ID, MENU_ID);
    return res.send(likedMenu);
  } catch (error) {
    console.error(error);
  }
};
