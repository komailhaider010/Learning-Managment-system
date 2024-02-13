const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {authenticateUser,
    authenticateAdmin,
} = require('../middleware/auth');
const { CreateCourse,
  updateCourseData,
  getAllCourses,
  getCourseDetails,
  uploadCourseThumbnail,
  uploadCourseDemoVideo,
  getCourseByUser } = require('../controllers/courseController');
const { configureStorage } = require('../config/fileUpload');
const router = express.Router();

// Configure storage for thumbnails
const thumbnailStorage = configureStorage('public/course_thumbnails');
const thumbnailUpload = multer({ storage: thumbnailStorage }).single('thumbnail');
const videoStorage = configureStorage('public/course_demoVideos')
const videoUpload = multer({storage: videoStorage}).single('video')

// FOR CREATING COURSE
router.post('/api/course/create-course', authenticateAdmin,  CreateCourse);
router.post('/api/course/upload-thumbnail', authenticateAdmin, thumbnailUpload,  uploadCourseThumbnail);
router.post('/api/course/upload-demovideo', authenticateAdmin, videoUpload,  uploadCourseDemoVideo);

router.put('/api/:courseId/update-course-data', authenticateAdmin,  updateCourseData);
router.get('/api/course/all-courses', authenticateUser,  getAllCourses);
router.get('/api/:courseId/course-details',  getCourseDetails);   
// GET PURCHASED COURSE DATA
router.get('/api/:courseId/course-data',authenticateUser,   getCourseByUser);   

module.exports = router;