const express = require("express");
const { authenticateUser, authenticateAdmin } = require("../middleware/auth");
const { addComment, addCommentReply } = require("../controllers/commentController");

const router = express.Router();

router.post('/api/:chapterId/add-question', authenticateUser, addComment)
router.post('/api/:commentId/add-reply', authenticateUser, addCommentReply)


module.exports = router