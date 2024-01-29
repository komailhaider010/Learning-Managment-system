const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title:{
        type: String,
    },
    description:{
        type: String,
    },
    thumbnail:{
        type: String,
    },
    video: {
        type: String,
    },
    videoLength: {
        type: Number,
    },
    videoPlayer:{
        type: String,
    },
    suggestions:{
        type: String,
    },
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment', 
    },],
}, {timestamps: true});

const Chapter = new mongoose.model("chapter", chapterSchema);
module.exports = Chapter;