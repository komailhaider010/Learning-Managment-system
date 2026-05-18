const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        required: true,
    },
    stripePaymentIntent: {
        type: String,
    }
}, {timestamps: true});

const Order = new mongoose.model("order", orderSchema);
module.exports = Order;