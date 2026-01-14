const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
            trim: true,
        },
        school: {
            type: String,
            required: [true, 'Please add a school name'],
            trim: true,
        },
        class: {
            type: String,
            required: [true, 'Please add a class/grade'],
            trim: true,
        },
        city: {
            type: String,
            required: [true, 'Please add a city'],
            trim: true,
        },
        state: {
            type: String,
            required: [true, 'Please add a state'],
            trim: true,
        },
        age: {
            type: Number,
            required: [true, 'Please add an age'],
            min: 5,
            max: 100,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: [true, 'Please select a gender'],
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'Pending'],
            default: 'Pending',
        },
        joinDate: {
            type: Date,
            default: Date.now,
        },
        lastActivity: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
studentSchema.index({ email: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ school: 1 });
studentSchema.index({ class: 1 });

module.exports = mongoose.model('Student', studentSchema);
