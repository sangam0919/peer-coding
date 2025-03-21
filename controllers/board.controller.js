const {boardAll,boardIndex, createboard, getComments,addComment,deleteBoard, editBoard} = require('../models/board');

const boardPageAll = async (req,res) => {
    try {
        const boards = await boardAll(); 
        res.render('board/boardMain', { boards }); 
    } catch (error) {
        console.error(error);
    }
}

const write = async (uid, title, content, image_path) => {
    try {
        console.log(uid)
        console.log(title,content,image_path)
        const data = await createboard(uid, title, content, image_path);
        return {state : 200, message : "게시글 작성 완료" , data};
    } catch (error) {
        console.log(error);
        return {state : 401,  message: "게시글 작성 중 오류가 발생했습니다." };
    }
}

const boardDetail = async (req, res) => {
    const { board_id } = req.params;
    try {
        const board = await boardIndex(board_id); 
        console.log(board);
        const comments = await getComments(board_id); 
        
        if (board) {
            res.render('board/boardDetail', { board, comments }); 
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}
const addCommentId = async (comment, board_id, uid) => {
    try {
        const data = await addComment( comment, board_id, uid)
        return { state: 200, message: "댓글이 추가되었습니다." };
    } catch (error) {
        console.log(error);
        return { state: 500, message: "댓글 추가 실패" };
    }
};

const deleteIndexBoard = async (board_id) => {
    try {
        const data = await deleteBoard(board_id);
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
};

const updateBoard = async (req, res) => {
    const { board_id } = req.params; 
    const { title, content } = req.body; 
    const image = req.file ? '/boardimgs/' + req.file.filename : board.image_path; 
    try {
        const data = await editBoard(title, content, board_id, image);
        if (data.state === 200) {
            res.send({ state: 200, message: "수정 완료" });
        } else {
            res.send({ state: 400, message: "수정 실패" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ state: 500, message: "서버 에러" });
    }
};

const getBoardById = async (req, res) => {
    const { board_id } = req.params;
    try {
        const board = await boardIndex(board_id);  
        res.render('board/boardUpdata', { board }); 
    } catch (error) {
        console.log(error);
    }
};

module.exports = {boardPageAll, write, boardDetail,addCommentId,deleteIndexBoard, updateBoard,getBoardById}