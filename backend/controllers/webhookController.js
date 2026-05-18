const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const User = require("../models/User");
const Course = require("../models/Course");
const Order = require("../models/Order");

const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(err.message);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    const courseId = paymentIntent.metadata.courseId;
    const userId = paymentIntent.metadata.userId;

    const course = await Course.findById(courseId);

    const order = await Order.create({
      user: req.user.userId,
      course: courseId,
      amount: course.price,
      paymentStatus: "paid",
      stripePaymentIntentId: paymentIntent.id,
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { courses: courseId },
    });

    console.log("Order created:", order._id);
  }

  res.status(200).json({ received: true });
};


module.exports = {
  stripeWebhook,
};