const boardProvider = require('../../app/Board/boardProvider');

exports.getBoardCategory = async function (req, res) {
  const boardCategoryList = await boardProvider.getBoardCategoryList();
  return res.send(boardCategoryList);
};
