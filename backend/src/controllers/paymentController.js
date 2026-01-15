const Razorpay = require('razorpay');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');

// Lazy initialization of Razorpay to prevent crash on startup if env vars are missing
let razorpay = null;

const getRazorpayInstance = () => {
    if (!razorpay) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error('Razorpay credentials (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) are not configured');
        }
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpay;
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/order
// @access  Public
const createOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        res.status(400);
        throw new Error('Please provide amount');
    }

    const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await getRazorpayInstance().orders.create(options);
        res.json({
            success: true,
            order,
            key_id: process.env.RAZORPAY_KEY_ID // Send key_id to frontend
        });
    } catch (error) {
        console.error('Razorpay Error:', error);
        res.status(500);
        throw new Error('Something went wrong with payment initialization');
    }
});

// @desc    Verify Payment Signature (Utility for internal server use)
// @param   {string} orderId
// @param   {string} paymentId
// @param   {string} signature
// @returns {boolean}
const verifyPaymentSignature = (orderId, paymentId, signature) => {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    return expectedSignature === signature;
};

module.exports = {
    createOrder,
    verifyPaymentSignature,
};
