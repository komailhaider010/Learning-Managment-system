const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Order = require("../models/orderModel");

const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("✅ WEBHOOK HIT");
    console.log("EVENT:", event.type);

  } catch (err) {
    console.log("❌ Webhook Error:", err.message);
    return res.status(400).send(err.message);
  }

  try {

    if (event.type === "payment_intent.succeeded") {

      const paymentIntent = event.data.object;

      console.log("METADATA:", paymentIntent.metadata);

      const courseId = paymentIntent.metadata.courseId;
      const userId = paymentIntent.metadata.userId;

      if (!courseId || !userId) {
        console.log("❌ Missing metadata");
        return res.status(400).json({
          error: "Metadata missing",
        });
      }

      const course = await Course.findById(courseId);

      if (!course) {
        console.log("❌ Course not found");
        return res.status(404).json({
          error: "Course not found",
        });
      }

      const order = await Order.create({
        userId: userId,
        courseId: courseId,
        amount: course.price,
        currency: "usd",
        paymentStatus: "paid",
        stripePaymentIntentId: paymentIntent.id,
      });

      await User.findByIdAndUpdate(userId, {
        $addToSet: { courses: courseId },
      });

      console.log("✅ ORDER CREATED:", order._id);
      console.log("✅ USER UPDATED");

    }

    res.status(200).json({
      received: true,
    });

  } catch (err) {
    console.log("❌ INTERNAL WEBHOOK ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};


// For Postman testing without Stripe signature verification
const stripeWebhookTest = async (req, res) => {
  try {
    console.log("WEBHOOK HIT (TEST MODE)");

    const event = req.body; // 🔥 direct JSON (no Stripe verify)

    if (event.type === "payment_intent.succeeded") {
  const paymentIntent = event.data.object;

  console.log("METADATA:", paymentIntent.metadata);

  const courseId = paymentIntent.metadata?.courseId;
  const userId = paymentIntent.metadata?.userId;

  if (!courseId || !userId) {
    console.log("Missing metadata");
    return res.json({ error: "No metadata found" });
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const order = await Order.create({
    userId: userId,
    courseId: courseId,
    amount: course.price,
    currency: course.currency || "usd",
    paymentStatus: "paid",
    stripePaymentIntentId: paymentIntent.id,
  });

  await User.findByIdAndUpdate(userId, {
    $addToSet: { courses: courseId },
  });

  console.log("Order created:", order._id);
}
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
  stripeWebhook,
  stripeWebhookTest
};