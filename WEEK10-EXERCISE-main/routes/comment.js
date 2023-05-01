const express = require("express");
const pool = require("../config")
const multer = require('multer')
const path = require('path')

const router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './static/uploads') // path to save file
    },
    filename: function (req, file, callback) {
        // set file name
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

// Get comment
router.get('/:blogId/comments', async function (req, res, next) {
    try {
        const [rows, fields] = await pool.query(`SELECT * FROM comments LEFT JOIN 
        (SELECT * FROM images) ON images.comment_id = comments.id WHERE blog_id = ?`, [req.params.blogId]);
        console.log(fields);
        return res.json(rows);
    } catch (err) {
        console.log(err)
        return next(err);
    }
});

// Create new comment
router.post('/:blogId/comments', upload.single('comment_image'), async function (req, res, next) {
    const file = req.file;
    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction();
    try {
        const payload = req.body
        const [rows, fields] = await conn.query("INSERT INTO comments (`blog_id`, `comment`, `like`, `comment_date`, `comment_by_id`) VALUES (?, ?, 0, CURRENT_TIMESTAMP, ?)", [req.params.blogId, payload.comment, null]);
        await conn.query("INSERT INTO images(blog_id, comment_id, file_path) VALUES(?, ?, ?);", [req.params.blogId, rows.insertId, file.path.substr(6).replaceAll("\\", "/")])
        conn.commit()
        return res.redirect('/blogs/' + req.params.blogId)
    } catch (err) {
        await conn.rollback();
        return next(err)
    }
});

// Update comment
router.put('/comments/:commentId', async function (req, res, next) {
    try {
        const payload = req.body
        const [rows, fields] = await pool.query("UPDATE comments SET `comment`=?, `like`=?, `comment_date`=?, `comment_by_id`=?, `blog_id`=? WHERE `id`=?",
            [payload.comment, payload.like, payload.comment_date, payload.comment_by_id, payload.blog_id, req.params.commentId]);

        return res.json({
            "message": `Comment ID ${req.params.commentId} is updated.`,
            "comment": {
                "comment": payload.comment,
                "like": payload.like,
                "comment_date": payload.comment_date,
                "comment_by_id": payload.comment_by_id,
                "blog_id": payload.blog_id
            }
        });
    } catch (err) {
        console.log(err)
        return next(err);
    }
});

// Delete comment
router.delete('/comments/:commentId', async function (req, res, next) {
    try {
        const payload = req.body
        const [rows, fields] = await pool.query("DELETE FROM comments WHERE `id`=?",
            [req.params.commentId]);
        return res.json({
            "message": `Comment ID ${req.params.commentId} is deleted.`
        });
    } catch (err) {
        console.log(err)
        return next(err);
    }
});

// Delete comment
router.put('/comments/addlike/:commentId', async function (req, res, next) {
    try {
        const payload = req.body
        const [row0, field0] = await pool.query("SELECT * FROM comments WHERE id = ?", [req.params.commentId])
        console.log(row0[0].like);
        const [rows, fields] = await pool.query("UPDATE comments SET `like`=? WHERE `id`=?",
            [row0[0].like + 1, req.params.commentId]);
        console.log(rows);
        return res.json({
            "blogId": row0[0].blog_id,
            "commentId": row0[0].id,
            "likeNum": row0[0].like + 1,
        });
    } catch (err) {
        console.log(err)
        return next(err);
    }
});


exports.router = router