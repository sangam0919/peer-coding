const multer = require('multer');
const path = require('path');

exports.upload = multer({
    storage : multer.diskStorage({
        destination : (req,res, cb) => {
            cb(null, 'public/boardimgs/')
        },
        filename : (req, file, cb) => {
            // 고양이.png 
            const ext = path.extname(file.originalname);
            // .png
            const filename = path.basename(file.originalname, ext) + "_" + Date.now() + ext;
            // 고양이
            cb(null, filename)
        }
    }),
    limits : {fileSize : 5 * 1024 * 1024} // 5mb
}) 