const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: false, // Could be null for non-student transactions later
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['Income', 'Payout', 'Refund'],
            default: 'Income',
            required: true,
        },
        source: {
            type: String,
            required: true, // e.g., "Student Registration", "Quiz Purchase"
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        status: {
            type: String,
            enum: ['Completed', 'Pending', 'Failed'],
            default: 'Completed',
        },
        paymentMethod: {
            type: String,
            default: 'Razorpay',
        },
        transactionId: { // Razorpay Payment ID or Bank Transfer ID
            type: String,
            required: true,
            unique: true
        },
        orderId: { // Razorpay Order ID
            type: String,
        },
        description: {
            type: String,
        },
        city: {
            type: String,
            default: 'Unknown'
        }
    },
    {
        timestamps: true,
    }
);

// Indexes
transactionSchema.index({ userId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
