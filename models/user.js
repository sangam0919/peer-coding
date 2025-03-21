const connectPool = require("./config")
// 데이터

// 유저 생성
const createUser = async (uid,upw,name,nick,gender,profile_path) => {
    try {
        await connectPool.query("INSERT INTO USER (uid,upw,name,nick,gender,profile_path) VALUES(?,?,?,?,?,?)", [uid,upw,name,nick,gender,profile_path]);
        console.log("유저 생성 완료")
        return {state:200, message : "회원가입 완료"}
    } catch (error) {
        console.log(error);
        return {state:400, message : "회원가입 실패"}
    }
}

// createUser("dd", "dd", "dd", "dd","dd","dd","dd" )


// 유저 조회-아이디
const userSelectFromUid = async (uid) => {
    try {
        const [[data]] = await connectPool.query("SELECT * FROM user WHERE uid = ? ", [uid])
        //console.log("userSelectFromUid:", data)
        return data;
    } catch (error) {
        console.log(error)
        return error;
    }
}

// 유저 조회-닉네임
const userSelectFromNick = async (nick) => {
    try {
        const [[data]] = await connectPool.query("SELECT * FROM user WHERE nick = ?", [nick])
        return data;
    } catch (error) {
        //console.log(error)
        return error;
    }
}
// 유저 수정

// 유저 삭제

module.exports = {createUser, userSelectFromUid, userSelectFromNick};