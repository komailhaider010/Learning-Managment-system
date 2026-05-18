const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    pric:{
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    tags: {
        type: String,
    },
    level:{
        type: String,
    },
    thumbnail:{
        type: String,
    },
    demoVideo: {
        type: String,
        required: true,
    },
    benifits:[{
        type: String,
    },],
    prerequisities:[{
        type: String,
    },],
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review',
    },],
    chapters:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chapter',
    }],
    enroll:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },],
    ratings:{
        type: Number,
        default: 0,
    },

}, {timestamps: true});

const Course = new mongoose.model("order", courseSchema);
module.exports = Course;