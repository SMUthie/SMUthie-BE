module.exports = function (app) {
  const board = require('./boardController');
  const { verifyAToken } = require('../../../config/jwtVerify');

  app.get('/app/board/category', board.getBoardCategory);

  app.get('/app/board/detail/:storeId', verifyAToken, board.getStoreInfo);

  app.delete('/app/board/forceresetstoreviews', board.forceResetStoreViews);

  app.put('/app/board/likeMenu/:menuId', verifyAToken, board.likeMenu);
};
