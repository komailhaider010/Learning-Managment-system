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


router.post('/signup', UserRegistration );
router.post('/otp-verification',authenticateUser,  signupOTPVerification );
router.post('/login', loginUser );
router.put('/update-profile',authenticateUser,avatarUpload,  updateUserProfile );
router.put('/update-password',authenticateUser,  updatePassword );
router.post('/forget-password',authenticateUser,  forgetPassword );
router.post('/reset-password',authenticateUser,  passwordOTPVerification);

module.exports = router;