module.exports = function (app) {
  const board = require('./boardController');
  const { verifyAToken } = require('../../../config/jwtVerify');

  app.get('/app/board/category/restaurant', board.getBoardRestaurant);
  app.get('/app/board/category/cafeteria', board.getBoardCafeteria);

  app.get('/app/board/detail/:storeId', verifyAToken, board.getStoreInfo);
};
