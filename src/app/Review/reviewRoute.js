module.exports = function(app){
    const review = require('./reviewController');

    // 1. 가게의 리뷰글 전체 조회 API
    app.get('/app/board/review/:storeIdx', review.getReviewAll); 

    // 2. 가게의 리뷰글 생성 API (Create)
    app.post('/app/board/review/:storeIdx', review.postReview); 

    // 3. 리뷰글 상세 조회 API
    app.get('/app/board/review/detail/:reviewIdx', review.getReview); 

    // 4. 리뷰글 수정 API
    app.patch('/app/board/review/:reviewIdx', review.patchReview); 
};