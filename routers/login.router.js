const router = require("express").Router();
const { signup, loginToken, login } = require("../controllers/login.controller");
const {upload} = require("../lib/user.upload");

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
router.get("/myPage", loginToken, (req,res)=> {
    res.render("mypage")
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

module.exports = router;