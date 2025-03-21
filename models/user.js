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

// 닉네임 수정
const EditNick = async (editNick,uid) => {
    try {
        const [data] = await connectPool.query('UPDATE user SET nick = ? WHERE uid = ?', [editNick, uid])
        console.log("user.js data:", data)
        return data;
    } catch (error) {
        return error
    }
}

// 프로필사진 수정
const editProfile = async (editFileName, uid) => {
    try {
        const [data] = await connectPool.query('UPDATE user SET profile_path= ? WHERE uid = ?', [editFileName, uid]);
        console.log("user.js file", data)
        return data;
    } catch (error) {
        return error;
    }
}

// 프로필사진 조회
const searchImage = async (uid) => {
    try {
        const [[data]] = await connectPool.query('SELECT profile_path FROM user WHERE uid = ?', [uid]);
        //console.log("searchimage data:",data);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}


// 유저 삭제
const deleteUser = async (uid) => {
    try {
        const data = await connectPool.query("DELETE FROM user WHERE uid = ?" ,[uid])
        console.log("delete data :", data);
        return data
    } catch (error) {
        return error
    }
}
module.exports = {createUser, userSelectFromUid, userSelectFromNick, EditNick, deleteUser, editProfile, searchImage};