const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {authenticateUser,
    authenticateAdmin,
} = require('../middleware/auth');
const { CreateCourse, updateCourseData, getAllCourses, getCourseDetails, uploadCourseThumbnail, uploadCourseDemoVideo } = require('../controllers/courseController');
const router = express.Router();

const thumbnailStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/course_thumbnails';
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
        const uploadDir = 'public/course_demoVideos';
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

// FOR CREATING COURSE
router.post('/api/course/create-course', authenticateAdmin,  CreateCourse);
router.post('/api/:corseId/upload-thumbnail', authenticateAdmin, thumbnailUpload,  uploadCourseThumbnail);
router.post('/api/:corseId/upload-demovideo', authenticateAdmin,videoUpload,  uploadCourseDemoVideo);


router.put('/api/:courseId/update-course-data', authenticateAdmin,  updateCourseData);
router.get('/api/course/all-courses', authenticateUser,  getAllCourses);
router.get('/api/:courseId/course-details',  getCourseDetails);   

module.exports = router;