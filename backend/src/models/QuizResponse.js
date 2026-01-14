const mongoose = require('mongoose');

const quizResponseSchema = new mongoose.Schema(
    {
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending Quiz', 'Sent', 'Completed'],
            default: 'Pending Quiz',
        },
        sentAt: {
            type: Date,
        },
        completedAt: {
            type: Date,
        },
        score: {
            type: Number,
            min: 0,
            max: 100,
        },
        responses: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for unique quiz-student combination
quizResponseSchema.index({ quizId: 1, studentId: 1 }, { unique: true });
quizResponseSchema.index({ status: 1 });

module.exports = mongoose.model('QuizResponse', quizResponseSchema);
