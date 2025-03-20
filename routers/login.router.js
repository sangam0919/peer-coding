const router = require("express").Router();

//------------------ 프론트
router.get("/", (req,res)=> {
    res.render("login");
})

module.exports = router;