const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const { createUser, userSelectFromUid , userSelectFromNick, EditNick, deleteUser, editProfile, searchImage} = require("../models/user");

// 회원가입 로직
const signup = async (uid,upw,name,nick,gender,profile_path) => {
    try {
        // 중복확인
        const createdUserUid = await userSelectFromUid(uid);
        const createdUserNick = await userSelectFromNick(nick);
        if (createdUserUid || createdUserNick) return {state:400, message : "중복된 아이디 혹은 닉네임 입니다."}

        const pwHash = bcrypt.hashSync(upw, 10);
        const data = await createUser(uid,pwHash,name,nick,gender,profile_path);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// 로그인 로직
const login = async (userid, upw) => {
    try {
        const userData = await userSelectFromUid(userid);
        const passwordCheck = bcrypt.compareSync(upw, userData.upw);

        if( !userData || !passwordCheck) return {state:400, message:"아이디가 존재하지 않거나 비밀번호가 틀렸습니다."}
        console.log("userData:", userData)

        //jwt 토큰 생성
        const {uid, name, nick, gender, profile_path } = userData;
        console.log("머지", userData)
        const jwtToken = jwt.sign({uid, name, nick, gender, profile_path}, process.env.TOKEN_KEY,{expiresIn:"30m"})
        return {state:200, message : "로그인 성공", userToken : { token : jwtToken}}
    } catch (error) {
        console.log(error)
    }
}

// 헤더에 jwt 토큰 추가
const loginToken = (req,res,next) => {
    const data = req.headers.cookie.split("=")[1];
    const userTokenData = jwt.verify(data, process.env.TOKEN_KEY);
    req.user = userTokenData;
    next();
}

// 닉네임 수정 로직
const userEditNick = async (editNick, uid) => {
    try {
        const nickCheck = await userSelectFromNick(editNick);
        if (nickCheck) return {state:400, message : "중복된 닉네임 존재"}
        
        const data = await EditNick(editNick,uid);
        return data;
    } catch (error) {
        console.log(error)
        return error;
    }

}

// 프사 수정 로직
const userEditImage = async (editFileName, uid) => {
    try {
        const fileCheck = await editProfile(editFileName, uid);
        console.log("filecheck", fileCheck)
        return fileCheck;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// 프사 삭제 로직
// const deleteImage = async(uid)=>{
//     try {
//         const data = await searchImage(uid);
//         if (data && data.profile_path) {
//             const oldImagePath = data.profile_path;
//             await fs.unlink(oldImagePath);
//             return { success: true, message: "이미지 삭제 성공" };
//         }
//         return { success: false, message: "삭제할 이미지가 없음" };
//     } catch (error) {
//         console.log("이미지 삭제 오류:", error);
//         return error;
//     }
// }

// 유저 삭제 로직
const userDelete = async(uid)=> {
    try {
        const result = await deleteUser(uid);
        if (!result) return {state:400, message : "유저 삭제 오류"}
    } catch (error) {
        console.log(error)
        return error;
    }
}
module.exports = {signup, loginToken, login, userEditNick, userDelete, userEditImage};