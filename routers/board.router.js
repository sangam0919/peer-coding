const express = require('express');
const {boardPageAll, write, boardDetail, addCommentId ,deleteIndexBoard ,updateBoard,getBoardById} = require('../controllers/board.controller') 
const {upload} = require('../lib/board.upload')
const loginToken  = require('../controllers/login.controller').loginToken

const router = express.Router();


router.get('/board',boardPageAll);

router.get('/detail/:board_id', boardDetail);

router.get('/write', (req,res)=>{
    res.render('board/boardWrite')
})

router.get('/edit/:board_id', getBoardById);

router.put('/update/:board_id', upload.single('image'), updateBoard);

router.post('/write', loginToken, upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const { path } = req.file
    const { uid } = req.user; 
    console.log(" 로그인한 사용자 uid:", uid);
    const data = await write(uid,title, content , "/" + path);
    console.log(data);
    res.json(data);
});

router.post('/delete', async (req, res) => {
    const { board_id } = req.body;
    const data = await deleteIndexBoard(board_id);
    console.log(data);
    res.redirect('/');
});

router.post('/comment',loginToken, async (req, res) => {
    const { comment, board_id } = req.body;
    const { uid } = req.user; 
    try {
        const data = await addCommentId(comment, board_id, uid);
        res.json(data);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;