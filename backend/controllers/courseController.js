const { response } = require('express');
const Course = require('../models/courseModel');
const fs = require('fs');
const path = require('path');
const { handleFileUpload } = require('../config/fileUpload');

const CreateCourse = async (req, res) => {
    const courseData = req.body;
    try {
        var thumbnail, demoVideo;
        // IF User UPLOAD A Thumbnil File
        if (req.files.thumbnail) {
            const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"]; // Allowed Exteniosn
            const fileFolderPath = path.join(__dirname,"..","public","course_thumbnails");
            thumbnail = `/course_thumbnails/`+ await handleFileUpload(req.files.thumbnail, allowedExtensions, fileFolderPath, res)
          }
        // IF User UPLOAD A Demo Video File
        if (req.files.demoVideo) {
            const allowedExtensions = [".mp4", ".WebM"]; // Allowed Exteniosn
            const fileFolderPath = path.join(__dirname,"..","public","course_demoVideos");
            demoVideo = `/course_demoVideos/`+ await handleFileUpload(req.files.demoVideo, allowedExtensions, fileFolderPath, res)
          }
        const courseCreated = await Course.create({
            name: courseData.name,
            description: courseData.description,
            price: courseData.price,
            estimatedPrice: courseData.estimatedPrice,
            tags: courseData.tags,
            level: courseData.level,
            thumbnail: thumbnail,
            demoVideo: demoVideo,
            benifits: courseData.benifits,
            prerequisities: courseData.prerequisities,
        });

        res.status(200).json({courseCreated, messages: "Sucessfully created course"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

const updateCourseData = async (req, res) => {
    const {courseId} = req.params;
    const {name, description, price, tags, level, benifits, prerequisities} = req.body;
    try {
        const course = await Course.findOne({_id: courseId});
        if (!course) {
            return res.status(404).json({message:"Course not found "});
        }
        if(name){
            course.name = name;
        }
        if(description){
            course.description = description;
        }
        if(price){
            course.price = price;
        }
        if(tags){
            course.tags = tags;
        }
        if(level){
            course.level = level;
        }
        if(benifits){
            course.benifits = benifits;
        }
        if(prerequisities){
            course.prerequisities = prerequisities;
        }
        const courseUpdate = await course.save();

        res.status(200).json({courseUpdate, message: "Course updated successfully"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });  
    }
}

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        if (!courses) {
            return res.status(404).json({message: 'No courses found'});
        }
        res.status(200).json({courses});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
}

const getCourseDetails = async (req, res) => {
    const {courseId} = req.params;
    try {
        const course = await Course.findById(courseId).populate('chapters', '-video -thumbnail -questions');
        if (!course) {
            return res.status(404).json({message: 'Course not found'});
        }
        res.status(200).json({course});    
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
}


module.exports = {
    CreateCourse,
    updateCourseData,
    getAllCourses,
    getCourseDetails,
}