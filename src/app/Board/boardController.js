const boardProvider = require('../../app/Board/boardProvider');

exports.getBoardCategory = async function (req, res) {
  try {
    const boardCategoryList = await boardProvider.getBoardCategoryList();
    return res.send(boardCategoryList);
  } catch (error) {
    console.error(error);
  }
};
