const express = require("express");
const pool = require("../config");

const router = express.Router();

// Get comment
router.get('/:blogId/comments', async function (req, res, next) {
    try {
        const [rows, fields] = await pool.query("SELECT * FROM comments WHERE blog_id = ?", [req.params.blogId]);
        return res.json(rows);
    } catch (err) {
        console.log(err)
        return next(err);
    }
});

// Create new comment
router.post('/:blogId/comments', async function (req, res, next) {
    try {
        const payload = req.body
        const [rows, fields] = await pool.query("INSERT INTO comments (`blog_id`, `comment`, `like`, `comment_date`, `comment_by_id`) VALUES (?, ?, ?, ?, ?)", [req.params.blogId, payload.comment, payload.like, "CURRENT_TIMESTAMP", payload.comment_by_id]);
        return res.json({ "message": `A new comment is added (ID: ${rows.insertId})` });
    } catch (err) {
        console.log(err)
        return next(err);
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
            "commentId":  row0[0].id,
            "likeNum": row0[0].like + 1,
        });
    } catch (err) {
        console.log(err)
        return next(err);
    }
});


exports.router = router