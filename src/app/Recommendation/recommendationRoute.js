module.exports = function(app){
    const recommendation = require('./recommendationController');

    // 1. 추천 메뉴 조회 API
    app.get('/app/recommendation', recommendation.getRecommendation); 

};