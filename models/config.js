const mysql2 = require("mysql2/promise")

// const connectPool = mysql2.createPool({
//     user : process.env.DATABASE_USER,
//     password : process.env.DATABASE_PASSWORD,
//     database : process.env.DATABASE_NAME,
//     host : process.env.DATABASE_HOST,
//     port : process.env.DATABASE_PORT,
//     multipleStatements : true
// })

const connectPool = mysql2.createPool({
    user : "zzeen",
    password : "issue0012",
    database : "project",
    host : "localhost",
    port : 3306,
    multipleStatements : true
})

// 커넥션 확인
connectPool.getConnection((err)=> {
    console.log(err);
})

const userTableInit = () => {
    try {
        connectPool.query('SELECT * FROM user')
        console.log('테이블이 존재합니다.')
    } catch (error) {
        connectPool.query(`CREATE TABLE USER (
            uid   VARCHAR(10)   NOT NULL PRIMARY KEY,
            upw   VARCHAR(128)   NULL,
            name   VARCHAR(20)   NULL,
            nick   VARCHAR(20)   NULL,
            gender   VARCHAR(20)   NULL,
            profile_path   VARCHAR(200)   NULL)
    `);
    console.log("유저 테이블 생성 완료")
    }
   
}

const boardTableInit = () => {
    try {
        connectPool.query('SELECT * FROM board')
        console.log("board테이블 있음")
    } catch (error) {
        connectPool.query(`CREATE TABLE board (
            board_id INT NOT NULL PRIMARY KEY,
            uid VARCHAR(10) NOT NULL,
            content VARCHAR(10) NULL,
            image_path VARCHAR(128) NULL,
            title VARCHAR(20) NULL,
            FOREIGN KEY (uid) REFERENCES user(uid)
        )
        `);
        console.log("board테이블 생성 완료")
    }  
}

const commentTableInit = () => {
    try {
        connectPool.query('SELECT * FROM comment')
        console.log("comment 테이블 있음")
    } catch (error) {
        connectPool.query(`CREATE TABLE comment (
            uid VARCHAR(10) NOT NULL,
            board_id INT NOT NULL,
            comment VARCHAR(120) NULL,
            FOREIGN KEY (uid) REFERENCES user(uid),
            FOREIGN KEY (board_id) REFERENCES board(board_id)
        )
        `);
        console.log("comment 테이블 생성 완료")
    }  
}
const likeaaTableInit = () => {
    try {
        connectPool.query('SELECT * FROM likeaa')
        console.log("좋아요 테이블 있음")
    } catch (error) {
        connectPool.query(`CREATE TABLE likeaa (
    uid VARCHAR(10) NOT NULL,
    board_id INT NOT NULL,
    FOREIGN KEY (uid) REFERENCES user(uid),
    FOREIGN KEY (board_id) REFERENCES board(board_id)
        )
        `);
        console.log("likeaa 테이블 생성 완료")
    }  
}
userTableInit()
boardTableInit()
commentTableInit()
likeaaTableInit()

module.exports = connectPool;