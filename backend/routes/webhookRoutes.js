const express = require("express");
const router = express.Router();

const { stripeWebhook } = require("../controllers/webhookController");

router.post("api/webhook/stripe", express.raw({ type: "application/json" }),stripeWebhook);

module.exports = router;