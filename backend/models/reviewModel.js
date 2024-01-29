const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    ratings:{
        type: Number,
        default : 0,
    },
    content: {
        type: String,
    },
    replies:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment',
        },]

}, {timestamps: true});

const Review = new mongoose.model("review", reviewSchema);
module.exports = Review;