const userDao = require('./userDao');

exports.collectMenusList = async function (connection, reviewContent) {
  const reviewIndex = reviewContent.review_idx;
  const menuList = await userDao.selectMenusByReview(connection, reviewIndex);

  const menuDetailList = [];
  for (let i = 0; i < menuList.length; i++) {
    const nowMenu = menuList[i];
    menuDetailList.push({
      menu_name: nowMenu.menu_name,
      menu_index: nowMenu.menu_idx,
    });
  }
  return menuDetailList;
};

//미아페이지 게시글 형식 반환
exports.formatReviewDate = function (reviewContent, menuList) {
  return {
    store_name: reviewContent.store_name,
    review_body: reviewContent.content,
    image_number: 9, //TODO: 이미지 사진 관련 업데이트 필요
    like_number: reviewContent.likes,
    unlike_number: reviewContent.unlikes,
    menus: menuList,
  };
};
