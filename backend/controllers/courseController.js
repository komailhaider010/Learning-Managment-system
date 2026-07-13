const { Cursor } = require("mongoose");
const Course = require("../models/courseModel");
const User = require("../models/userModel");
// const Comment = require('../models/commentModel');

const CreateCourse = async (req, res) => {
  const courseData = req.body;
  try {
    const courseCreated = await Course.create({
      name: courseData.name,
      description: courseData.description,
      price: courseData.price,
      estimatedPrice: courseData.estimatedPrice,
      currency: courseData.currency,
      tags: courseData.tags,
      level: courseData.level,
      thumbnail: courseData.thumbnail,
      demoVideo: courseData.demoVideo,
      benifits: courseData.benifits,
      prerequisities: courseData.prerequisities,
    });

    res
      .status(200)
      .json({ courseCreated, messages: "Sucessfully created course" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const uploadCourseThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }
    const thumbnail = "/" + req.file.destination + "/" + req.file.filename;
    if (!thumbnail) {
      return res.status(400).json({ message: "Thumbnail not uploaded" });
    }
    res
      .status(200)
      .json({ thumbnail, message: "Sucessfully Upload Course Thumbnail" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const uploadCourseDemoVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }
    const demoVideo = "/" + req.file.destination + "/" + req.file.filename;
    if (!demoVideo) {
      return res.status(404).json({ message: "Demo Video not Uploaded" });
    }
    res
      .status(200)
      .json({ demoVideo, message: "Sucessfully Upload Course Demo Video" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCourseData = async (req, res) => {
  const { courseId } = req.params;
  const { name, description, price, tags, level, benifits, prerequisities } =
    req.body;
  try {
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found " });
    }
    if (name) {
      course.name = name;
    }
    if (description) {
      course.description = description;
    }
    if (price) {
      course.price = price;
    }
    if (tags) {
      course.tags = tags;
    }
    if (level) {
      course.level = level;
    }
    if (benifits) {
      course.benifits = benifits;
    }
    if (prerequisities) {
      course.prerequisities = prerequisities;
    }
    const courseUpdate = await course.save();

    res
      .status(200)
      .json({ courseUpdate, message: "Course updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllCourses = async (req, res) => {
  try {
    // 1. Get the current user to find the courses they already have
    // (Assuming req.user.id is populated by your authentication middleware)
    const { userId } = req.user;
    const user = await User.findById(userId);

    // 2. Fetch courses where the _id is NOT IN the user's courses array
    const courses = await Course.find({
      _id: { $nin: user.courses },
    });

    // Mongoose find() returns an empty array [] if nothing matches, not null.
    if (courses.length === 0) {
      return res.status(404).json({ message: "No new courses found" });
    }

    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCourseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId)
  .populate("chapters", "title description suggestions")
  .populate({
    path: "reviews",
    // Use an array to populate multiple distinct paths inside the review object
    populate: [
      {
        path: "user",        // 1. Populate the user who made the review
        select: "name avatar"
      },
      {
        path: "replies",     // 2. Populate the replies array
        populate: {
          path: "user",      // 3. Deep populate the user who made the reply
          select: "name avatar"
        }
      }
    ]
  });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCourseByUser = async (req, res) => {
  const { userId } = req.user;
  const { courseId } = req.params;
  try {
    const { courses } = await User.findOne({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "chapters",
          populate: {
            path: "questions",
            populate: {
              path: "user",
              select: "-password -email -courses -isVerified",
            },
          },
        },
      })
      .populate({
        path: "courses",
        populate: {
          path: "reviews",
          populate: {
            path: "user",
            select: "-password -courses -isVerified",
          },
        },
      })
      .populate({
        path: "courses",
        populate: {
          path: "chapters",
          populate: {
            path: "questions",
            populate: {
              path: "replies",
              select: "-password -email -courses -isVerified",
              populate: {
                path: "user",
                select: "-password -email -courses -isVerified",
              },
            },
          },
        },
      });
    if (!courses) {
      return res.status(400).json({ message: "You are not eligible" });
    }
    // Find the specific course within the user's courses array
    const matchingCourse = courses.find((course) => course._id == courseId);
    if (!matchingCourse) {
      return res.status(400).json({ message: "You are not eligible" });
    }
    res.status(200).json({ matchingCourse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllCoursesDashboard = async (req, res) => {
  try {
   

    // 2. Fetch courses where the _id is NOT IN the user's courses array
    const courses = await Course.find();

    // Mongoose find() returns an empty array [] if nothing matches, not null.
    if (courses.length === 0) {
      return res.status(404).json({ message: "No new courses found" });
    }

    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  CreateCourse,
  uploadCourseThumbnail,
  uploadCourseDemoVideo,
  updateCourseData,
  getAllCourses,
  getCourseDetails,
  getCourseByUser,
  getAllCoursesDashboard,
};
