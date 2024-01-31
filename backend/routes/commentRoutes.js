const express = require("express");
const { authenticateUser, authenticateAdmin } = require("../middleware/auth");
const { addComment } = require("../controllers/commentController");

const router = express.Router();

router.post('/api/:chapterId/add-question', authenticateUser, addComment)


module.exports = router