const Chapter = require('../models/chapterModel');
const Course = require('../models/courseModel');


const createChapter = async(req, res)=>{
    const {courseId} = req.params;
    const {title, description, videoPlayer, suggestions, } = req.body;
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
                videoLength: "",
                videoPlayer,
                suggestions,
                thumbnail : "",
                video: "",
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
    const {chapterId} = req.params;
    const thumbnail = "/" + req.file.destination + '/' + req.file.filename;
    try {
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        chapter.thumbnail = thumbnail;
        await chapter.save();
        res.status(200).json({chapter ,message: 'Sucessfully Upload Chapter Thumbnail'});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
};
const uploadChapterVideo = async (req, res) => {
    const {chapterId} = req.params;
    const {videoLength} = req.body;
    const video = "/" + req.file.destination + '/' + req.file.filename;
    try {
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        chapter.video = video;
        chapter.videoLength = videoLength;
        await chapter.save();
        res.status(200).json({chapter ,message: 'Sucessfully Upload Chapter Thumbnail'});
        
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
