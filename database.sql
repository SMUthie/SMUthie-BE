CREATE TABLE `User` (
	`user_idx`	Int	NOT NULL PRIMARY KEY	AUTO_INCREMENT,
	`student_id`	Varchar(15)	NOT NULL	COMMENT '@sangmyung.kr',
	`pw`	varchar(100)	NOT NULL,
	`nickname`	Varchar(15)	NOT NULL,
	`token`	mediumtext	NULL	COMMENT '로그인시 사용',
	`created_at`	timestamp	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`updated_at`	timestamp	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT 'ON UPDATE CURRENT_TIMESTAMP(업데이트 시 현재 시간으로 설정)',
	`stat`	varchar(2)	NOT NULL	DEFAULT 'A'	COMMENT '활성 : A, 탈퇴 : D',
	`auth_code`	Varchar(10)	 NULL	COMMENT '각종 인증 이메일에 사용',
	`level_times`	Int	NOT NULL DEFAULT 0
);

CREATE TABLE `Store` (
	`store_idx`	Int	NOT NULL	PRIMARY KEY	AUTO_INCREMENT,
	`name`	tinytext	NOT NULL,
	`category`	Varchar(2)	NOT NULL	COMMENT '식당: R, 카페: C, 안다미로: A',
	`address`	mediumtext	NOT NULL,
	`latitude`	DECIMAL(17, 15)	NOT NULL,
	`longitude`	DECIMAL(18, 15)	NOT NULL,
	`view_count`	Int	NOT NULL	DEFAULT 0,
	`time`	text	NOT NULL	COMMENT 'HH:MM 리스트로 보내주기',
	`telephone`	Varchar(15)	NULL,
	`cafe_hashtag`	text	NULL	COMMENT 'category: C일 경우만 사용',
	`mark_image`	mediumtext	NULL
);

CREATE TABLE `Cafeteria` (
	`cafeteria_idx`	Int	NOT NULL	PRIMARY KEY	AUTO_INCREMENT,
	`category`	VARCHAR(255)	NOT NULL	COMMENT '자율한식:K, 푸드코트:F',
	`date`	DATE	NOT NULL,
	`menu`	text	NOT NULL	COMMENT '리스트로 보내기'
);

CREATE TABLE `Review` (
	`review_idx`	Int	NOT NULL	PRIMARY KEY	AUTO_INCREMENT,
	`user_idx`	Int	NOT NULL,
	`store_idx`	Int	NOT NULL,
	`content`	mediumtext	NOT NULL,
	`likes`	Int	NOT NULL	DEFAULT 0,
	`unlikes`	Int	NOT NULL	DEFAULT 0,
	`image_url`	mediumtext	NOT NULL	COMMENT '콤마로 구분',
	`created_at`	DATETIME	NOT NULL	DEFAULT	CURRENT_TIMESTAMP
);

CREATE TABLE `Menu` (
	`menu_idx`	Int	NOT NULL	PRIMARY KEY	AUTO_INCREMENT,
	`store_idx`	INT	NOT NULL,
	`menu_name`	tinytext	NOT NULL,
	`price`	Int	NOT NULL,
	`likes`	Int	NOT NULL	DEFAULT 0,
	`comment`	mediumtext	NULL	COMMENT '안다미로만',
	`image_url`	mediumtext	NOT NULL	COMMENT '콤마로 구분',
	`is_up`	TINYINT(1)	NOT NULL	COMMENT '아래: 0, 위: 1',
	`is_rice`	TINYINT(1)	NOT NULL	COMMENT '밥 아님: 0, 밥: 1',
	`is_soup`	TINYINT(1)	NOT NULL	COMMENT '국물 아님: 0, 국물: 1',
	`is_meat`	TINYINT(1)	NOT NULL	COMMENT '고기 아님: 0, 고기: 1',
	`is_spicy`	TINYINT(1)	NOT NULL	COMMENT '맵지 않음: 0, 매움: 1'
);

CREATE TABLE `Report` (
	`report_idx`	Int	NOT NULL	PRIMARY KEY	AUTO_INCREMENT,
	`store_idx`	INT	NOT NULL,
	`menu_idx`	Int	NULL,
	`user_idx`	Int	NOT NULL,
	`content`	mediumtext	NOT NULL,
	`likes`	Int	NOT NULL	DEFAULT 0,
	`unlikes`	Int	NOT NULL	DEFAULT 0,
	`category`	tinytext	NOT NULL	COMMENT '폐업, 메뉴 종류, 가격 정보, 전화번호, 영업 시간',
	`created_at`	DATETIME	NOT NULL	DEFAULT	CURRENT_TIMESTAMP
);

CREATE TABLE `ReviewMenu` (
	`review_idx`	Int	NOT NULL,
	`menu_idx`	Int	NOT NULL	
);

CREATE TABLE `UserLikedMenu` (
	`user_idx`	Int	NOT NULL,
	`menu_idx`	Int	NOT NULL
);

CREATE TABLE `UserLikedReview` (
	`user_idx`	Int	NOT NULL,
	`review_idx`	Int	NOT NULL
);

CREATE TABLE `UserUnlikedReview` (
	`user_idx`	Int	NOT NULL,
	`review_idx`	Int	NOT NULL
);

CREATE TABLE `UserLikedReport` (
	`user_idx`	Int	NOT NULL,
	`report_idx`	Int	NOT NULL	
);

CREATE TABLE `UserUnlikedReport` (
	`user_idx`	Int	NOT NULL,
	`report_idx`	Int	NOT NULL	
);

ALTER TABLE `Review` ADD CONSTRAINT `FK_User_TO_Review_1` FOREIGN KEY (
	`user_idx`
)
REFERENCES `User` (
	`user_idx`
)
ON DELETE CASCADE;

ALTER TABLE `Menu` ADD CONSTRAINT `FK_Store_TO_Menu_1` FOREIGN KEY (
	`store_idx`
)
REFERENCES `Store` (
	`store_idx`
)
ON DELETE CASCADE;

ALTER TABLE `ReviewMenu` ADD CONSTRAINT `FK_Review_TO_ReviewMenu_1` FOREIGN KEY (
	`review_idx`
)
REFERENCES `Review` (
	`review_idx`
)
ON DELETE CASCADE;

ALTER TABLE `ReviewMenu` ADD CONSTRAINT `FK_Menu_TO_ReviewMenu_1` FOREIGN KEY (
	`menu_idx`
)
REFERENCES `Menu` (
	`menu_idx`
)
ON DELETE CASCADE;

ALTER TABLE `Report` ADD CONSTRAINT `FK_Store_TO_Report_1` FOREIGN KEY (
	`store_idx`
)
REFERENCES `Store` (
	`store_idx`
)
ON DELETE CASCADE;

ALTER TABLE `UserLikedMenu` ADD CONSTRAINT `FK_User_TO_UserLikedMenu_1` FOREIGN KEY (
	`user_idx`
)
REFERENCES `User` (
	`user_idx`
)
ON DELETE CASCADE;

ALTER TABLE `UserLikedMenu` ADD CONSTRAINT `FK_Menu_TO_UserLikedMenu_1` FOREIGN KEY (
	`menu_idx`
)
REFERENCES `Menu` (
	`menu_idx`
)
ON DELETE CASCADE;

ALTER TABLE `UserLikedReview` ADD CONSTRAINT `FK_User_TO_UserLikedReview_1` FOREIGN KEY (
	`user_idx`
)
REFERENCES `User` (
	`user_idx`
)
ON DELETE CASCADE;

ALTER TABLE `UserLikedReview` ADD CONSTRAINT `FK_Review_TO_UserLikedReview_1` FOREIGN KEY (
	`review_idx`
)
REFERENCES `Review` (
	`review_idx`
)
ON DELETE CASCADE;

ALTER TABLE `UserUnlikedReview` ADD CONSTRAINT `FK_User_TO_UserUnlikedReview_1` FOREIGN KEY (
	`user_idx`
)
REFERENCES `User` (
	`user_idx`
)
ON DELETE CASCADE;

ALTER TABLE `UserUnlikedReview` ADD CONSTRAINT `FK_Review_TO_UserUnlikedReview_1` FOREIGN KEY (
	`review_idx`
)
REFERENCES `Review` (
	`review_idx`
)
ON DELETE CASCADE;

ALTER TABLE `UserLikedReport` ADD CONSTRAINT `FK_User_TO_UserLikedReport_1` FOREIGN KEY (
	`user_idx`
)
REFERENCES `User` (
	`user_idx`
)
ON DELETE CASCADE;

ALTER TABLE `UserLikedReport` ADD CONSTRAINT `FK_Report_TO_UserLikedReport_1` FOREIGN KEY (
	`report_idx`
)
REFERENCES `Report` (
	`report_idx`
)
ON DELETE CASCADE;

ALTER TABLE `UserUnlikedReport` ADD CONSTRAINT `FK_User_TO_UserUnlikedReport_1` FOREIGN KEY (
	`user_idx`
)
REFERENCES `User` (
	`user_idx`
)
ON DELETE CASCADE;

ALTER TABLE `UserUnlikedReport` ADD CONSTRAINT `FK_Report_TO_UserUnlikedReport_1` FOREIGN KEY (
	`report_idx`
)
REFERENCES `Report` (
	`report_idx`
)
ON DELETE CASCADE;

INSERT INTO SMUthie.Store (store_idx, name, category, address, latitude, longitude, time, telephone, cafe_hashtag, mark_image) VALUES (1, '안다미로 학식', 'A', '서울 종로구 홍지문2길 20 상명대학교 월해관 2층', 37.603969713888650, 126.956635525908910, '11:00-14:00', '02-2287-5274', NULL, 'https://picsum.photos/300/200.jpg');
INSERT INTO SMUthie.Store (store_idx, name, category, address, latitude, longitude, time, telephone, cafe_hashtag, mark_image) VALUES (2, '안다미로 카페', 'C', '서울 종로구 홍지문2길 20 상명대학교 월해관 2층', 37.603969713888650, 126.956635525908910, '09:00-17:00', '02-2287-5274', '월해관', 'https://picsum.photos/300/200.jpg');
INSERT INTO SMUthie.Store (store_idx, name, category, address, latitude, longitude, time, telephone, cafe_hashtag, mark_image) VALUES (3, '블루포트', 'C', '서울 종로구 홍지문2길 20 상명대학교 미래백년관 1층', 37.604156550733320, 126.955113376401850, '08:00-19:00', NULL, '미백관', 'https://picsum.photos/300/200.jpg');
INSERT INTO SMUthie.Store (store_idx, name, category, address, latitude, longitude, time, telephone, cafe_hashtag, mark_image) VALUES (4, '카페드림', 'C', '서울 종로구 홍지문2길 20 상명대학교 교수회관 1층', 37.601428242031770, 126.954825113638220, '08:10-18:00', '02-394-1007', '교수회관', 'https://picsum.photos/300/200.jpg');

INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (1, 1, '순대국', 7800, 50, '역시 안다미로 대표 메뉴', 'https://picsum.photos/800/300.jpg', 1,1,1,0,0);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (2, 1, '얼큰 순대국', 7800, 20, '신흥 강자', 'https://picsum.photos/800/300.jpg', 1,1,1,0,1);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (3, 1, '사골 부대찌개', 7800, 1, 'JMT', 'https://picsum.photos/800/300.jpg', 1,1,1,0,1);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (4, 1, '제육볶음', 7800, 100, '맛있는데 자극적이에요', 'https://picsum.photos/800/300.jpg', 1,1,0,1,1);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (5, 1, '돼지불고기', 7800, 0, NULL, 'https://picsum.photos/800/300.jpg', 1,1,0,1,0);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (6, 1, '안다가츠동', 7000, 0, NULL, 'https://picsum.photos/800/300.jpg', 1,1,0,1,0);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (7, 1, '김치가츠동', 7200, 0, NULL, 'https://picsum.photos/800/300.jpg', 1,1,0,1,1);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (8, 1, '새우에비동', 7200, 0, NULL, 'https://picsum.photos/800/300.jpg', 1,1,0,1,0);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (9, 1, '등심돈까스', 7000, 0, NULL, 'https://picsum.photos/800/300.jpg', 1,1,0,1,0);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (10, 1, '치즈돈까스', 7000, 0, NULL, 'https://picsum.photos/800/300.jpg', 1,1,0,1,0);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (11, 1, '계란라면', 4000, 0, NULL, 'https://picsum.photos/800/300.jpg', 1,0,1,0,1);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (12, 1, '치즈라면', 4500, 0, NULL, 'https://picsum.photos/800/300.jpg', 1,0,1,0,1);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (13, 1, '순대라면', 7500, 0, NULL, 'https://picsum.photos/800/300.jpg', 1,0,1,0,1);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (14, 1, '마요참치주먹밥', 3800, 0, NULL, 'https://picsum.photos/800/300.jpg', 1,1,0,0,0);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (15, 1, '참치김치 밥버거', 3000, 0, NULL, 'https://picsum.photos/800/300.jpg', 1,1,0,0,1);
INSERT INTO SMUthie.Menu (menu_idx, store_idx, menu_name, price, likes, comment, image_url, is_up, is_rice, is_soup, is_meat, is_spicy) VALUES (16, 1, '돈가스데리 밥버거', 3800, 0, NULL, 'https://picsum.photos/800/300.jpg', 1,1,0,1,0);