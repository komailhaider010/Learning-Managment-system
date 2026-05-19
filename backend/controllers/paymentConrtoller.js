const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Course = require("../models/courseModel");
const User = require("../models/userModel");

const createPaymentIntent = async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.courses.includes(courseId)) {
      return res.status(400).json({ message: "User has already purchased this course" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.price * 100,
      currency: "usd",
      metadata: {
        courseId,
        userId,
      },
    });
    

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPaymentIntent,
};