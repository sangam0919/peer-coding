const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, userSelectFromUid , userSelectFromNick} = require("../models/user");

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
    if(!req.headers.cookie) return  res.redirect();
    const data = req.headers.cookie.split("=")[1];
    const userTokenData = jwt.verify(data, process.env.TOKEN_KEY);
    req.user = userTokenData;
    next();
}
module.exports = {signup, loginToken, login};