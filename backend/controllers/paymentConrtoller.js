const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Course = require("../models/courseModel");

const createPaymentIntent = async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
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