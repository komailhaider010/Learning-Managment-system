const Chapter = require('../models/chapterModel');
const Comment = require('../models/commentModel');


const addComment = async (req, res) => {
    const {content} = req.body;
    const {chapterId} = req.params;
    const {userId} = req.user;
    try {
        if (!content) {
            return res.status(400).json({message: "Please Required field"});
        }
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({message: "Chapter Not Found"});
        }

        const comment = await Comment.create({
            user: userId,
            content,
        })
        chapter.questions.push(comment);
        await chapter.save();
        
        res.status(200).json({comment, message:"Sucessfully Added Comment"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const addCommentReply = async (req, res) => {
    const {content} = req.body;
    const {commentId} = req.params;
    const {userId} = req.user;
    console.log(commentId);
    try {
        if (!content) {
            return res.status(400).json({message: "Please Required field"});
        }
        const comment = await Comment.findById(commentId);
        console.log(comment);
        if (!comment) {
            return res.status(404).json({message: "Comment Not Found"});
        }

        const commentCreate = await Comment.create({
            user: userId,
            content,
        })
        comment.replies.push(commentCreate);
        await comment.save();
        
        res.status(200).json({comment, message:"Sucessfully Added Comment Reply"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = {
    addComment,
    addCommentReply,
}