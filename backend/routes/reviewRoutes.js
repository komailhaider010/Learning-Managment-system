const express = require('express');
const { addReview } = require('../controllers/reviewController')
const { authenticateUser, authenticateAdmin } = require('../middleware/auth')

const router = express.Router();

router.post('/api/:courseId/add-review', authenticateUser , addReview );


module.exports = router