const jwtMiddleware = require("../../../config/jwtVerify");
const reviewProvider = require("../Review/reviewProvider");
const reviewService = require("../Review/reviewService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 가게의 리뷰글 전체 조회 API
 * [GET] /app/board/review/:storeIdx
 */
exports.getReviewAll = async function (req, res) {
  const storeIdx = req.params.storeIdx;
  const reviewListResult = await reviewProvider.retrieveReviewList(storeIdx);
  
  return res.send(response(baseResponse.SUCCESS, reviewListResult));
};

/**
 * API No. 2
 * API Name : 가게의 리뷰글 생성 API (Create)
 * [POST] /app/board/review/:storeIdx
 */
exports.postReview = async function (req, res) {
  /*
    * Body : userIdx, content, imageUrlList, menutag
  */
  const storeIdx = req.params.storeIdx;
  const { userIdx, content, imageUrlList, menuTag } = req.body;

  console.log('입력한 해시태그::', menuTag)
  // TODO: JWT user 검증

  //빈 값 체크
  if (!userIdx)
    return res.send("유저 미입력");
  if (!content)
    return res.send("내용 미입력");
  if (!imageUrlList || !imageUrlList.length)
    return res.send("이미지 미입력");
  if (!menuTag)
   return res.send("메뉴 해시태그 미입력");

  const reviewResponse = await reviewService.createReview(
    storeIdx,
    userIdx,
    content,
    imageUrlList,
    menuTag
  );

  return res.send(reviewResponse);
};

/**
 * API No. 3
 * API Name : 가게의 리뷰글 상세 조회 API
 * [GET] /app/board/review/detail/:reviewIdx
 */
exports.getReview = async function (req, res) {
  const reviewIdx = req.params.reviewIdx;
  const reviewResult = await reviewProvider.retrieveReview(reviewIdx);

  return res.send(response(baseResponse.SUCCESS, reviewResult));
};

/**
 * API No. 4
 * API Name : 가게의 리뷰글 수정 API
 * [PATCH] /app/board/review/:reviewIdx
 */
exports.patchReview = async function (req, res) {
  /*
    * Body : content
  */
  const reviewIdx = req.params.reviewIdx;
  const content = req.body.content;

  // TODO: JWT user 검증

  //빈 값 체크
  if (!content)
    return res.send("내용 미입력");

  const reviewResponse = await reviewService.updateReview(
    content,
    reviewIdx,
  );

  return res.send(reviewResponse);
};

/**
 * API No. 5
 * API Name : 가게의 리뷰글 삭제 API
 * [DELETE] /app/board/review/:reviewIdx
 */
exports.deleteReview = async function (req, res) {
  const reviewIdx = req.params.reviewIdx;

  // TODO: JWT user 검증

  const reviewResponse = await reviewService.deleteReview(reviewIdx);

  return res.send(reviewResponse);
};