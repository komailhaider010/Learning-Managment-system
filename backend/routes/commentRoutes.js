const express = require("express");
const { authenticateUser, authenticateAdmin } = require("../middleware/auth");
const { addComment, addCommentReply, getSingleComment } = require("../controllers/commentController");

const router = express.Router();

router.post('/api/:chapterId/add-question', authenticateUser, addComment)
router.post('/api/:commentId/add-reply', authenticateUser, addCommentReply)
router.get('/api/:commentId/get-single-comment', getSingleComment)

module.exports = router