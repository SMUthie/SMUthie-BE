module.exports = function (app) {
  const board = require('./boardController');
  const { verifyAToken } = require('../../../config/jwtVerify');

  app.get('/app/board/category', board.getBoardCategory);
};
