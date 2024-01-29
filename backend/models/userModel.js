const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String ,
        required: true
    },
    email: {
        type: String ,
        required: true,
        unique: true,
    },
    password: {
        type: String ,
        required: true
    },
    avatar: {
        type: String,
        default: '/default/default_profile_pic.png'
    },
    role: {
        type: String,
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'course'
        },
    ]
}, {timestamps: true});

const User = new mongoose.model("user", userSchema);
module.exports = User;