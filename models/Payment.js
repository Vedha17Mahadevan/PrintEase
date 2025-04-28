const mongoose = require('mongoose');

// Payment Schema with screenshot name
const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User collection
        required: true,
        ref: 'User'
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Order collection
        required: true,
        ref: 'Order'
    },
    amount: {
        type: Number,
        required: true
    },
    paymentScreenshot: {
        type: String, // Store the name of the payment screenshot
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
