const express = require("express");
const path = require("path");
const { authenticateUser, authenticateAdmin } = require("../middleware/auth");
const { createChapter } = require("../controllers/chapterController");

const router = express.Router();
  
router.post("/api/:courseId/create-chapter",authenticateAdmin,createChapter);
  
module.exports = router;
  