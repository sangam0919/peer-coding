const connectPool = require('./config');


const boardAll = async() => {
    try {
        const [data] = await connectPool.query('SELECT * FROM board')
        console.log(data);
        return data;

    } catch (error) {
        console.log(error);
    }
}

const boardIndex = async (board_id) => {
    try {
        const [[data]] = await connectPool.query('select * from board where board_id=?',[board_id])
        return data;
    } catch (error) {
        console.log(error)
    }
}

const getComments = async (board_id) => {
    try {
        const [data] = await connectPool.query('SELECT * FROM comment WHERE board_id = ?', [board_id]);
        return data;
    } catch (error) {
        console.error("댓글 조회 오류:", error);
    }
}

const addComment = async (comment,board_id,uid) => {
    try {
        const data =  await connectPool.query('INSERT INTO comment (comment,board_id,uid) VALUES (?, ?, ?)',[comment,board_id,uid]);
        return { state: 200, message: "댓글이 추가되었습니다." };
    } catch (error) {
        console.error("댓글 추가 오류:", error);
        throw error;
    }
};

const createboard = async (uid, title, content, image_path) => {
    try {
        // uid가 유효한지 확인 (선택 사항, 예: 로그인된 사용자의 uid가 있는지 확인)
        const [user] = await connectPool.query('SELECT uid FROM user WHERE uid = ?', [uid]);
        if (!user) {
            throw new Error('유저가 존재하지 않습니다.');
        }
        // 게시글 작성
        const [data] = await connectPool.query('INSERT INTO board (uid, title, content, image_path) VALUES (?, ?, ?, ?)',[uid, title, content, image_path]);
        return { state: 200, message: "글 작성 완료" };
    } catch (error) {
        console.log(error);  // 오류 로그 출력
        return { state: 500, message: "글 작성 실패" };
    }
}

const deleteBoard = async (board_id) => {
    try {
        console.log(`삭제할 게시글 ID: ${board_id}`);
        const [data] = await connectPool.query("DELETE FROM board WHERE board_id=?", [board_id]);
        console.log('Delete result:', data);
        console.log("삭제 결과", data)
        // await connectPool.query("SET @count = 0");
        // await connectPool.query("UPDATE board SET board_id = @count := @count + 1");
        // await connectPool.query("ALTER TABLE board AUTO_INCREMENT = 1"); 
        return { state: 200, message: "삭제 완료, 번호 재조정 완료, AUTO_INCREMENT 초기화됨" };
    } catch (error) {
        console.log(error);
        return { state: 500, message: "삭제 실패", error: error.message };
    }
};


const editBoard = async (title, content, board_id, image) => {
    try {
        if (image) {
            const [data] = await connectPool.query( "UPDATE board SET title=?, content=?, image_path=? WHERE board_id=?", [title, content, image, board_id]);
        };
        return { state: 200, message: "수정 성공" };
    } catch (error) {
        console.log(error);
        return { state: 500, message: "수정 실패", error: error.message };
    }
};







module.exports = {boardAll ,boardIndex,  createboard, getComments, addComment,deleteBoard,editBoard };