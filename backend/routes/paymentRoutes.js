const express = require("express");
const router = express.Router();

const { createPaymentIntent } = require("../controllers/paymentConrtoller");


router.post("/create-payment-intent", createPaymentIntent);

module.exports = router;