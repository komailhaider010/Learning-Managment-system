const express = require('express');
const {authenticateUser,
    authenticateAdmin,
} = require('../middleware/auth');
const { CreateCourse, updateCourseData, getAllCourses, getCourseDetails } = require('../controllers/courseController');

const router = express.Router();

router.post('/api/course/create-course', authenticateAdmin,  CreateCourse);
router.put('/api/:courseId/update-course-data', authenticateAdmin,  updateCourseData);
router.get('/api/course/all-courses', authenticateUser,  getAllCourses);
router.get('/api/:courseId/course-details',  getCourseDetails);   

module.exports = router;