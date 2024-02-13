const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { authenticateUser, authenticateAdmin } = require("../middleware/auth");
const { createChapter,
    uploadChapterThumbnail,
    uploadChapterVideo,
 } = require("../controllers/chapterController");
const { configureStorage } = require("../config/fileUpload");
const router = express.Router();


// Chapter Thumbnail Configurations
// Chapter Video Configurations
const thumbnailStorage = configureStorage('public/chapter_thumbnails');
const videoStorage = configureStorage('public/chapter_videos');

const thumbnailUpload = multer({storage: thumbnailStorage}).single('thumbnail')
const videoUpload = multer({storage: videoStorage}).single('video')

// Creating Course Chapter
router.post("/api/chapter/upload-thumbnail",authenticateAdmin,thumbnailUpload, uploadChapterThumbnail);
router.post("/api/chapter/upload-video",authenticateAdmin,videoUpload, uploadChapterVideo);

// After Uploading File Chapter Create
router.post("/api/:courseId/create-chapter",authenticateAdmin,createChapter);

  
module.exports = router;
  