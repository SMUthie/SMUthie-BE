CREATE TABLE `User` (
	`user_idx`	Int	NOT NULL PRIMARY KEY	AUTO_INCREMENT,
	`student_id`	Varchar(15)	NOT NULL	COMMENT '@sangmyung.kr',
	`pw`	varchar(100)	NOT NULL,
	`nickname`	Varchar(15)	NOT NULL,
	`token`	mediumtext	NULL	COMMENT '로그인시 사용',
	`created_at`	timestamp	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`updated_at`	timestamp	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT 'ON UPDATE CURRENT_TIMESTAMP(업데이트 시 현재 시간으로 설정)',
	`stat`	varchar(2)	NOT NULL	DEFAULT 'A'	COMMENT '활성 : A, 탈퇴 : D'
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
	`image_url`	mediumtext	NOT NULL	COMMENT '콤마로 구분'
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

CREATE TABLE `ReviewMenu` (
	`review_idx`	Int	NOT NULL,
	`menu_idx`	Int	NOT NULL	
);

CREATE TABLE `Report` (
	`report_idx`	Int	NOT NULL	PRIMARY KEY	AUTO_INCREMENT,
	`store_idx`	INT	NOT NULL,
	`menu_idx`	Int	NULL,
	`user_idx`	Int	NOT NULL,
	`content`	mediumtext	NOT NULL,
	`likes`	Int	NOT NULL	DEFAULT 0,
	`category`	tinytext	NOT NULL	COMMENT '폐업, 메뉴 종류, 가격 정보, 전화번호, 영업 시간'
);

CREATE TABLE `UserLikedMenu` (
	`user_idx`	Int	NOT NULL,
	`menu_idx`	Int	NOT NULL
);

CREATE TABLE `CopyOfUserLikedMenu` (
	`user_idx`	Int	NOT NULL,
	`review_idx`	Int	NOT NULL
);

CREATE TABLE `CopyOfCopyOfUserLikedMenu` (
	`user_idx`	Int	NOT NULL,
	`report_idx`	Int	NOT NULL	
);

ALTER TABLE `Review` ADD CONSTRAINT `FK_User_TO_Review_1` FOREIGN KEY (
	`user_idx`
)
REFERENCES `User` (
	`user_idx`
);

ALTER TABLE `Menu` ADD CONSTRAINT `FK_Store_TO_Menu_1` FOREIGN KEY (
	`store_idx`
)
REFERENCES `Store` (
	`store_idx`
);

ALTER TABLE `ReviewMenu` ADD CONSTRAINT `FK_Review_TO_ReviewMenu_1` FOREIGN KEY (
	`review_idx`
)
REFERENCES `Review` (
	`review_idx`
);

ALTER TABLE `ReviewMenu` ADD CONSTRAINT `FK_Menu_TO_ReviewMenu_1` FOREIGN KEY (
	`menu_idx`
)
REFERENCES `Menu` (
	`menu_idx`
);

ALTER TABLE `Report` ADD CONSTRAINT `FK_Store_TO_Report_1` FOREIGN KEY (
	`store_idx`
)
REFERENCES `Store` (
	`store_idx`
);

ALTER TABLE `UserLikedMenu` ADD CONSTRAINT `FK_User_TO_UserLikedMenu_1` FOREIGN KEY (
	`user_idx`
)
REFERENCES `User` (
	`user_idx`
);

ALTER TABLE `UserLikedMenu` ADD CONSTRAINT `FK_Menu_TO_UserLikedMenu_1` FOREIGN KEY (
	`menu_idx`
)
REFERENCES `Menu` (
	`menu_idx`
);

ALTER TABLE `CopyOfUserLikedMenu` ADD CONSTRAINT `FK_User_TO_CopyOfUserLikedMenu_1` FOREIGN KEY (
	`user_idx`
)
REFERENCES `User` (
	`user_idx`
);

ALTER TABLE `CopyOfUserLikedMenu` ADD CONSTRAINT `FK_Review_TO_CopyOfUserLikedMenu_1` FOREIGN KEY (
	`review_idx`
)
REFERENCES `Review` (
	`review_idx`
);

ALTER TABLE `CopyOfCopyOfUserLikedMenu` ADD CONSTRAINT `FK_User_TO_CopyOfCopyOfUserLikedMenu_1` FOREIGN KEY (
	`user_idx`
)
REFERENCES `User` (
	`user_idx`
);

ALTER TABLE `CopyOfCopyOfUserLikedMenu` ADD CONSTRAINT `FK_Report_TO_CopyOfCopyOfUserLikedMenu_1` FOREIGN KEY (
	`report_idx`
)
REFERENCES `Report` (
	`report_idx`
);