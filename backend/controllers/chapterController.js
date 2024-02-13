const Chapter = require('../models/chapterModel');
const Course = require('../models/courseModel');


const createChapter = async(req, res)=>{
    const {courseId} = req.params;
    const {title, description, videoPlayer, suggestions, thumbnail, video, videoLength} = req.body;
    try {
        if(!courseId){
            return res.status(400).json({message: 'Course Id required'});
        }
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({message: 'Course Not Found'});
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

const uploadChapterThumbnail = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({message: 'File is required'})
        }
        const thumbnail = "/" + req.file.destination + '/' + req.file.filename;
        if(!thumbnail){
            res.status(400).json({ message: 'thumbnail File not uploaded' });
        }
        res.status(200).json({thumbnail ,message: 'Sucessfully Upload Chapter Thumbnail'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
};
const uploadChapterVideo = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({message: 'File is required'})
        }
        const video = "/" + req.file.destination + '/' + req.file.filename;
        if (!video) {
            res.status(400).json({ message: 'Video File not Uploaded' });
        }
        res.status(200).json({video ,message: 'Sucessfully Upload Chapter Thumbnail'});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
};



module.exports = {
    createChapter,
    uploadChapterThumbnail,
    uploadChapterVideo,
}
