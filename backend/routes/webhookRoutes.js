const express = require("express");
const router = express.Router();

const { stripeWebhook , stripeWebhookTest } = require("../controllers/webhookController");

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

//For Postman testing
router.post(
  "/stripetest",
  express.json(), // 🔥 NOT raw in test mode
  stripeWebhookTest
);

module.exports = router;