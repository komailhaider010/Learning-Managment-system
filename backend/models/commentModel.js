const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    content:{
        type: String,
    },
    replies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
    },]

}, {timestamps: true});

const Comment = new mongoose.model("comment", commentSchema);
module.exports = Comment;