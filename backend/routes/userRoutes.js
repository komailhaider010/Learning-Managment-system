const express = require('express');
const {authenticateUser,
     authenticateAdmin,
} = require('../middleware/auth');
const { UserRegistration,
     signupOTPVerification,
     loginUser,
     updateUserProfile,
     updatePassword,
     forgetPassword,
     passwordOTPVerification,
     } = require('../controllers/userController');

     
const router = express.Router();


router.post('/api/user/signup', UserRegistration );
router.post('/api/user/otp-verification',authenticateUser,  signupOTPVerification );
router.post('/api/user/login', loginUser );
router.put('/api/user/update-profile',authenticateUser,  updateUserProfile );
router.put('/api/user/update-password',authenticateUser,  updatePassword );
router.post('/api/user/forget-password',authenticateUser,  forgetPassword );
router.post('/api/user/reset-password',authenticateUser,  passwordOTPVerification);

module.exports = router;