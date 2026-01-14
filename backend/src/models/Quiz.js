const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a quiz title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            trim: true,
        },
        category: {
            type: String,
            enum: ['Screening', 'Academic', 'Scholarship', 'Placement'],
            required: [true, 'Please add a category'],
        },
        questions: {
            type: Number,
            required: [true, 'Please add number of questions'],
            min: 1,
        },
        timeLimit: {
            type: String,
            required: [true, 'Please add a time limit'],
        },
        status: {
            type: String,
            enum: ['Active', 'Draft', 'Archived'],
            default: 'Draft',
        },
        type: {
            type: String,
            enum: ['Google Form', 'Internal'],
            default: 'Internal',
        },
        link: {
            type: String,
            default: '#',
        },
        googleSheetId: {
            type: String,
            required: false,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        lastModified: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Update lastModified on save
quizSchema.pre('save', function (next) {
    this.lastModified = Date.now();
    next();
});

// Indexes
quizSchema.index({ status: 1 });
quizSchema.index({ category: 1 });
quizSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
