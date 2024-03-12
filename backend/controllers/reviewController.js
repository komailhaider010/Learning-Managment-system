const Course = require('../models/courseModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');

const addReview = async(req, res)=>{
    const {userId} = req.user;
    const {courseId} = req.params;
    const {ratings , content} = req.body;
    try {
        const {courses} = await User.findById(userId).populate('courses');
        if (!courses) {
            return res.status(400).json({message:'You do not have Courses'})
        }
        const courseExist = courses.some(course => course._id.toString() === courseId.toString());
        if(!courseExist) {
            return res.status(400).json({message:'Course does not exist'});
        }
        const addReview = await Review.create({
            user: userId,
            ratings,
            content
        });
        // Push the saved review into the Course.reviews array
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { reviews: addReview._id } },
            { new: true } // To return the updated document
        );
        res.status(200).json({addReview,  message: 'Review Added successfully'});   
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
};

module.exports = {
    addReview,
}