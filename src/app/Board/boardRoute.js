module.exports = function (app) {
  const board = require('./boardController');
  const { verifyAToken } = require('../../../config/jwtVerify');

  app.get('/app/board/category', board.getBoardCategory);

  app.get('/app/board/detail/:storeId', verifyAToken, board.getStoreInfo);

  app.put('/app/board/likeMenu/:menuId', verifyAToken, board.likeMenu);

  app.get('/app/board/search', board.searchReview);
};
