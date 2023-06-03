module.exports = function(app){
    const home = require('./homeController');

    // 1. 교내 카페 정보 조회 API 
    app.get('/app/home/cafe', home.getSchoolCafe); 

    // 2. 안다미로 정보 조회 API 
    app.get('/app/home/andamiro', home.getAndamiro); 

};