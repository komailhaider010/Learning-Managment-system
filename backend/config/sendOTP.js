require('dotenv').config();
const nodemailer = require('nodemailer');

// Function to send OTP to user's email
const sendOTPEmail = async (userEmail, OTP, subject) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // Update with your Gmail email
            pass: process.env.EMAIL_PASS, // Update with your Gmail password or use an app password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL, // Update with your Gmail email
        to: userEmail,
        subject: subject,
        text: `Your OTP is: ${OTP} Please don't Share to anyone, Expire in 5 minutes`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendOTPEmail,
}