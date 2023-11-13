module.exports = function(app){
    const map = require('./mapController');

    // 1. 지도 전체 식당 목록 조회 API
    app.get('/app/map/store', map.getStores); 

    // 2. 지도 음식점 목록 조회 API
    app.get('/app/map/restaurant', map.getRestaurants); 

    // 3. 지도 카페 목록 조회 API
    app.get('/app/map/cafe', map.getCafes); 
};