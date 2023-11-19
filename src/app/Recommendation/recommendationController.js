const recommendationProvider = require('../Recommendation/recommendationProvider');
const baseResponse = require('../../../config/baseResponseStatus');
const { response, errResponse } = require('../../../config/response');

/**
 * API No. 1
 * API Name : 추천 메뉴 조회 API
 * [GET] /app/recommendation
 */
exports.getRecommendation = async function (req, res) {
  const isUp = req.query.isUp;
  const isRice = req.query.isRice;
  const isSoup = req.query.isSoup;
  const isMeat = req.query.isMeat;
  const isSpicy = req.query.isSpicy;

  console.log(isUp, isRice, isSoup, isMeat, isSpicy);
  const recommendationListResult =
    await recommendationProvider.retrieveRecommendation(
      isUp,
      isRice,
      isSoup,
      isMeat,
      isSpicy
    );

    for (let i = 0; i < recommendationListResult.length; i++) {
      if (recommendationListResult[i]['menu_name'] === '메뉴판') {
          recommendationListResult.splice(i, 1);
          i--;
      }
  }
  // console.log(recommendationListResult); 

  return res.send(response(baseResponse.SUCCESS, recommendationListResult));
};
