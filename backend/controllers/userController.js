const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { sendOTPEmail } = require('../config/sendOTP');

// GENERATING AN OTP
const generateOTP = ()=>{
    const OTP = Math.floor(1000 + Math.random() * 9000).toString();
    return OTP;
}
// USER REGISTRATION AND SEND OTP TO USER EMAIL
const UserRegistration = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name && !email && !password) {
            return res.status(400).json({ message: 'Please enter all required fields'});
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User Already Exists' });
        }
        // Hashed OTP
        const OTP = (generateOTP()).toString();
        const subject = "OTP for Signup Registration"
        try {
            sendOTPEmail(email, OTP, subject);
            const token = jwt.sign({
                name, email, password, OTP
            },
                process.env.SECRET_KEY,
                {expiresIn: "5m"}
                )
            res.status(200).json({token, message: "Please Check Email to Verify OTP"});
                   
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error sending OTP"});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
// VERIFICATION USER OTP AND REGISTER USER
const signupOTPVerification = async(req, res)=>{
    const {userOTP} = req.body;
    const {name, email, password, OTP} = req.user;
    try {
        if(!userOTP){
            return res.status(400).json({ message: 'Please enter OTP password' });
        }
        if(userOTP !== OTP){
            return res.status(400).json({ message: 'Please Try a Valid OTP' });
        }

        const user = await User.findOne({ email});
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const userRegister = await User.create({
            name, 
            email, 
            password: hashedPassword,
            isVerified: true,
        });
    
        res.status(200).json({userRegister, message: 'User Register Sucessfully'});    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// LOGININ USER
const loginUser =async (req, res) => {
    const {email, password} = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({message: 'Please enter All fields'});
        }
        const user = await User.findOne({email});
        if (!user) {
           return res.status(404).json({message: 'User Not Found'});
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({menubar: 'Invalid email or password'});
        }

        const token = jwt.sign({userId: user._id, email: user.email, role: user.role},
            process.env.SECRET_KEY,)
        
        res.status(200).json({token, user, message: 'Login Sucessfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// UPDATE USER
const updateUserProfile = async(req, res)=>{
    const {userId} = req.user;
    const {name} = req.body;
    const avatarFile = req.files ? req.files.avatar : null;
    try {
        const user = await User.findOne({_id: userId});
        if (!user) {
            return res.status(404).json({message: 'User Not Found'});
        }
        // If user want to update avatar
        if(name){
            user.name = name;
        }
        // IF User UPLOAD A Profile Pic
        if (avatarFile) {
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"]; // Allowed Exteniosn
        const fileExtension = path.extname(avatarFile.name).toLowerCase(); // Checking User File Extension
  
        //if user have not allowed extensions
        if (!allowedExtensions.includes(fileExtension)) {
          return res.status(400).json({ message: "Invalid file type. Please Try Another File Type" });
        }
  
        const uniqueImageName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const folderPathImage = path.join(__dirname,"..","public","users_profile_images");
        const avatarPathImage = path.join(__dirname,"..","public");
        // IF FOULDER NOT EXIST
        if (!fs.existsSync(folderPathImage)) {
          fs.mkdirSync(folderPathImage, { recursive: true });
        }

        const avatarPath = path.join(folderPathImage, uniqueImageName + fileExtension);

        const isDefaultAvatar = user.avatar.includes('/default/default_profile_pic.png');
        if (!isDefaultAvatar && fs.existsSync(avatarPathImage + user.avatar)) {
            fs.unlinkSync(avatarPathImage + user.avatar);
        }
        // Move the uploaded file to the server
        await avatarFile.mv(avatarPath);
        user.avatar = `/users_profile_images/${uniqueImageName + fileExtension}`;
      }

      await user.save();
      res.status(200).json({user, message: "User Updated Successfully"});
  
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updatePassword = async (req, res) => {
    const {userId} = req.user;
    const {newPassword, oldPassword} = req.body;
    try {
        if(!oldPassword || !newPassword){
            return res.status(400).json({message: 'Please enter All fields'});
        }
        const user = await User.findOne({_id: userId});
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({message: 'Invalid password Please try again'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({message: 'Password updated successfully'})

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const forgetPassword = async(req, res) => {
    const {userId} = req.user;
    try {
        const subject = "OTP For Reseting Password"
        const OTP = generateOTP();
        const {email} = await User.findOne({_id: userId});
        sendOTPEmail(email, OTP, subject).then(() => {
            const token = jwt.sign({userId, email, OTP},
                process.env.SECRET_KEY,
                {expiresIn: "2m"});
            res.status(200).json({token, message: "Secessfully send OTP message"});
        }).catch(err => {
            res.status(500).json({message: "Error while Sending OTP: "});
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });   
    }
}

const passwordOTPVerification = async(req, res)=>{
    const {userId , OTP} = req.user;
    const {newPassword, userOTP } = req.body;
    try {
        if(userOTP !== OTP){
            return res.status(400).json({message: 'Invalid OTP Entered'});
        }

        const user = await User.findOne({_id: userId});
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;

        await user.save();
        res.status(200).json({message: "Password Reset Sucessfully"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}




module.exports = {
    UserRegistration,
    signupOTPVerification,
    loginUser,
    updateUserProfile,
    updatePassword,
    forgetPassword,
    passwordOTPVerification,
}