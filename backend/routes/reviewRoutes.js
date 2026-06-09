const express = require('express');
const { addReview, addReplyToReview} = require('../controllers/reviewController')
const { authenticateUser, authenticateAdmin } = require('../middleware/auth')

const router = express.Router();

router.post('/api/:courseId/add-review', authenticateUser , addReview );
router.post('/api/:reviewId/add-review-reply', authenticateAdmin , addReplyToReview );


module.exports = router