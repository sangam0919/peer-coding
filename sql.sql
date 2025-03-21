CREATE TABLE user (
    uid VARCHAR(10) NOT NULL PRIMARY KEY,
    upw VARCHAR(128) NULL,
    name VARCHAR(20) NULL,
    nick VARCHAR(20) NULL,
    gender VARCHAR(20) NULL,
    profile_path VARCHAR(200) NULL
);
CREATE TABLE board (
    board_id INT NOT NULL PRIMARY KEY,
    uid VARCHAR(10) NOT NULL,
    content VARCHAR(10) NULL,
    image_path VARCHAR(128) NULL,
    title VARCHAR(20) NULL,
    FOREIGN KEY (uid) REFERENCES user(uid)
);

CREATE TABLE comment (
    uid VARCHAR(10) NOT NULL,
    board_id INT NOT NULL,
    comment VARCHAR(120) NULL,
    FOREIGN KEY (uid) REFERENCES user(uid),
    FOREIGN KEY (board_id) REFERENCES board(board_id)
);

CREATE TABLE likeaa (
    uid VARCHAR(10) NOT NULL,
    board_id INT NOT NULL,
    FOREIGN KEY (uid) REFERENCES user(uid),
    FOREIGN KEY (board_id) REFERENCES board(board_id)
); 

use project;

SELECT * FROM user;

ALTER TABLE board;

desc board;

SHOW CREATE TABLE comment\G