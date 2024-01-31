const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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

const avatarStorage = multer.diskStorage({
     destination: function (req, file, cb) {
         const uploadDir = 'public/user_profile_images';
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

 const avatarUpload = multer({storage: avatarStorage}).single('avatar')


router.post('/api/user/signup', UserRegistration );
router.post('/api/user/otp-verification',authenticateUser,  signupOTPVerification );
router.post('/api/user/login', loginUser );
router.put('/api/user/update-profile',authenticateUser,avatarUpload,  updateUserProfile );
router.put('/api/user/update-password',authenticateUser,  updatePassword );
router.post('/api/user/forget-password',authenticateUser,  forgetPassword );
router.post('/api/user/reset-password',authenticateUser,  passwordOTPVerification);

module.exports = router;