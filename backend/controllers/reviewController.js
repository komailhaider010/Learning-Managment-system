const Course = require('../models/courseModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

const addReview = async (req, res) => {
    const { userId } = req.user;
    const { courseId } = req.params;
    const { ratings, content } = req.body;

    try {
        const { courses } = await User.findById(userId).populate('courses');
        if (!courses) {
            return res.status(400).json({ message: 'You do not have Courses' })
        }
        
        const courseExist = courses.some(course => course._id.toString() === courseId.toString());
        if (!courseExist) {
            return res.status(400).json({ message: 'Sorry: You are not enrolled in this course' });
        }

        // 1. Create the new review
        const newReview = await Review.create({
            user: userId,
            ratings: Number(ratings), // Ensure it's a number
            content
        });

        // 2. Push the review ID into the Course and POPULATE all reviews to get their rating values
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { reviews: newReview._id } },
            { new: true }
        ).populate('reviews'); 

        // 3. Calculate the new average rating
        let averageRating = 0;
        if (updatedCourse.reviews && updatedCourse.reviews.length > 0) {
            const totalRatingsSum = updatedCourse.reviews.reduce((sum, review) => sum + review.ratings, 0);
            averageRating = totalRatingsSum / updatedCourse.reviews.length;
            
            // Optional: Round to 1 decimal place (e.g., 4.333333 -> 4.3)
            averageRating = Math.round(averageRating * 10) / 10;
        }

        // 4. Save the calculated average rating back to the course
        updatedCourse.ratings = averageRating; // Make sure 'averageRating' exists in your Course Schema
        await updatedCourse.save();

        const populatedReview = await newReview.populate('user', 'name _id avatar');

        res.status(200).json({ 
            review: populatedReview, 
            averageRating, 
            message: 'Review Added and Course Rating Updated successfully' 
        });   
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
};

const addReplyToReview = async (req, res) => {
    const { userId } = req.user;
    const { reviewId } = req.params;
    const { content } = req.body;
    try{
        const review = await Review.findById(reviewId);
        if(!review){
            return res.status(404).json({message: 'Review Not Found'});
        }
        const createComment = await Comment.create({
            user: userId,
            content,
        });
        review.replies.push(createComment);
        await review.save();

        res.status(200).json({review, message: 'Reply Added to Review Successfully'});

    }catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
}

module.exports = {
    addReview,
    addReplyToReview
}