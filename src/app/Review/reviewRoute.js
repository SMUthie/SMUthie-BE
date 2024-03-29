const { verifyAToken } = require('../../../config/jwtVerify');

module.exports = function(app){
    const review = require('./reviewController');

    // 1. 가게의 리뷰글 전체 조회 API
    app.get('/app/board/review/:storeIdx', review.getReviewAll); 

    // 2. 가게의 리뷰글 생성 API (Create)
    app.post('/app/board/review/:storeIdx', verifyAToken, review.postReview); 

    // 3. 리뷰글 상세 조회 API
    app.get('/app/board/review/detail/:reviewIdx', verifyAToken, review.getReview); 

    // 4. 리뷰글 수정 API
    app.patch('/app/board/review/:reviewIdx', verifyAToken, review.patchReview); 

    // 5. 리뷰글 삭제 API
    app.delete('/app/board/review/:reviewIdx', verifyAToken, review.deleteReview); 

    // 6. 리뷰글 좋아요 누르기
    app.put('/app/board/review/like/:reviewIdx', verifyAToken, review.likeReview);

    // 7. 리뷰글 싫어요 누르기
    app.put('/app/board/review/unlike/:reviewIdx', verifyAToken, review.unlikeReview);
};