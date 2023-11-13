module.exports = function(app){
    const map = require('./mapController');

    // 1. 지도 전체 식당 목록 조회 API
    app.get('/app/map/store', map.getRestaurants); 

};