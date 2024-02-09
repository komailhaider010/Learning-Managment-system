const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { authenticateUser, authenticateAdmin } = require("../middleware/auth");
const { createChapter,
    uploadChapterThumbnail,
    uploadChapterVideo,
 } = require("../controllers/chapterController");
const router = express.Router();
// Chapter Thumbnail Configurations
const thumbnailStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/chapter_thumbnails';
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        const fileUniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname).toLowerCase();
        cb(null, fileUniqueName + fileExtension);
      }
});
// Chapter Video Configurations
const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/chapter_videos';
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        const fileUniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname).toLowerCase();
        cb(null, fileUniqueName + fileExtension);
      }
});
const thumbnailUpload = multer({storage: thumbnailStorage}).single('thumbnail')
const videoUpload = multer({storage: videoStorage}).single('video')

// Creating Course Chapter
router.post("/api/:courseId/create-chapter",authenticateAdmin,createChapter);
router.post("/api/chapter/upload-thumbnail",authenticateAdmin,thumbnailUpload, uploadChapterThumbnail);
router.post("/api/chapter/upload-video",authenticateAdmin,videoUpload, uploadChapterVideo);
  
module.exports = router;
  