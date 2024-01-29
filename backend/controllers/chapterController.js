const fs = require('fs');
const path = require('path');
const Chapter = require('../models/chapterModel');
const Course = require('../models/courseModel');
const {handleFileUpload} = require('../config/fileUpload');
const { log } = require('console');


const createChapter = async(req, res)=>{
    const {courseId} = req.params;
    const {title, description, videoLength, videoPlayer, suggestions, } = req.body;
    try {
        var video , thumbnail;
        if(!courseId){
            return res.status(400).json({message: 'Course Id required'});
        }
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({message: 'Course Not Found'});
        }
        // IF User UPLOAD A Thumbnail File
        if (req.files && req.files.thumbnail) {
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
            const fileFolderPath = path.join(__dirname, '..', 'public', 'chapter_thumbnails');
            thumbnail = `/chapter_thumbnails/` + await handleFileUpload(req.files.thumbnail, allowedExtensions, fileFolderPath,res,);
        }

        // If UUpload a video file
        if (req.files && req.files.video) {
            const allowedExtensions = ['.mp4', '.webm']; // Allowed Extensions
            const fileFolderPath = path.join(__dirname, '..', 'public', 'chapter_videos');
            video = `/chapter_videos/` + await handleFileUpload(req.files.video, allowedExtensions, fileFolderPath,res);
        }
        try {
            const chapterCreated = await Chapter.create({
                title,
                description,
                videoLength,
                videoPlayer,
                suggestions,
                thumbnail,
                video,
            });
            course.chapters.push(chapterCreated);
            await course.save();
            res.status(201).json({chapterCreated, message: 'Chapter created successfully'});    
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error while Creating Chapter' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }

}



module.exports = {
    createChapter,
}
