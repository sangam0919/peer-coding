const fs = require("fs").promises;
const router = require("express").Router();
const { signup, loginToken, login, userEditNick, userEditImage, deleteImage, userDelete } = require("../controllers/login.controller");
const {upload} = require("../lib/user.upload");
const { searchImage } = require("../models/user");

//------------------ 프론트

// 로그인
router.get("/", (req,res)=> {
    res.render("login");
})

// 회원가입
router.get("/signup", (req,res)=> {
    res.render("signup");
})


// 마이페이지
router.get("/mypage", loginToken, (req,res)=> {
    // console.log(req.user)
    const {uid,name,nick,gender,profile_path} = req.user
    res.render("mypage", {uid,name,nick,gender,profile_path});
})

//--------------------- 백엔드

router.post("/login", async (req,res) => {
    const {uid, upw} = req.body;
    const data = await login(uid,upw);
    console.log("server login:", data)

    if (data.state===200){
        const {token} = data.userToken;
        console.log("data token : ", token)
        res.cookie("login-token", token , {
            maxAge : 30*60*60*1000,
            httpOnly : true
        })
        //console.log("server login token", data)
    }
    res.json(data)
})

router.post("/signup", upload.single('image'), async (req,res) => {
    try {
        const {uid,upw,name,nick,gender} = req.body;
        const {path} = req.file;
        const data = await signup(uid,upw,name,nick,gender,"/" + path);
        console.log(data)
        res.json (data);
    } catch (error) {
        return {state:400, message:"서버오류"}
    }

})

// 닉네임 수정 라우터
router.post("/editnick",loginToken, async(req,res)=> {
    const {editNick} =  req.body
    const {uid} = req.user

    //console.log("newnick : ", editNick, "nick :", uid);
    const data = await userEditNick(editNick,uid);
    //console.log("edit data server", data)
    res.json(data);
})

// 프로필사진 수정 라우터
router.post("/editImage", loginToken, upload.single("image"), async (req,res)=> {
    try {
        const { uid } = req.user;

        const { path: newPath } = req.file;

        const existingUser = await searchImage(uid);
        const oldImagePath = existingUser?.profile_path;
        const updateResult = await userEditImage(newPath, uid);

        await fs.unlink(oldImagePath); 


        res.json({ path: newPath, data: updateResult });
        
    } catch (error) {
        console.log("editImage 오류:", error);
        res.status(500).json({ state: 400, message: "서버 오류" });
    }
});



// 유저 삭제 라우터
router.post("/delete",loginToken, async(req,res) => {
    const {uid} = req.user;
    const data = userDelete(uid)
    //console.log("server data result", data)
})

module.exports = router;