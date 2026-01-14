const asyncHandler = require('express-async-handler');
const Quiz = require('../models/Quiz');
const QuizResponse = require('../models/QuizResponse');

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private/Admin
const getQuizzes = asyncHandler(async (req, res) => {
    const { status, category, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status && status !== 'All') {
        query.status = status;
    }

    if (category) {
        query.category = category;
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    const skip = (page - 1) * limit;

    const quizzes = await Quiz.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

    // Get response counts for each quiz
    const quizzesWithStats = await Promise.all(
        quizzes.map(async (quiz) => {
            const responses = await QuizResponse.countDocuments({ quizId: quiz._id });
            return {
                ...quiz.toObject(),
                responses,
            };
        })
    );

    const total = await Quiz.countDocuments(query);

    res.json({
        success: true,
        data: quizzesWithStats,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
        },
    });
});

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
const getQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name email');

    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
    }

    const responses = await QuizResponse.countDocuments({ quizId: quiz._id });

    res.json({
        success: true,
        data: {
            ...quiz.toObject(),
            responses,
        },
    });
});

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private/Admin
const createQuiz = asyncHandler(async (req, res) => {
    const { title, description, category, questions, timeLimit, type, link, status } = req.body;

    const quiz = await Quiz.create({
        title,
        description,
        category,
        questions,
        timeLimit,
        type: type || 'Internal',
        link: link || '#',
        status: status || 'Draft',
        createdBy: req.user._id,
    });

    res.status(201).json({
        success: true,
        data: quiz,
        message: 'Quiz created successfully',
    });
});

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
const updateQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.json({
        success: true,
        data: updatedQuiz,
        message: 'Quiz updated successfully',
    });
});

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
const deleteQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
    }

    // Delete all associated responses
    await QuizResponse.deleteMany({ quizId: quiz._id });

    await quiz.deleteOne();

    res.json({
        success: true,
        message: 'Quiz and associated responses deleted successfully',
    });
});

// @desc    Send quiz to students
// @route   POST /api/quizzes/:id/send
// @access  Private/Admin
const sendQuiz = asyncHandler(async (req, res) => {
    const { studentIds } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
    }

    if (!studentIds || !Array.isArray(studentIds)) {
        res.status(400);
        throw new Error('Please provide an array of student IDs');
    }

    // Create quiz responses for each student
    const responses = await Promise.all(
        studentIds.map(async (studentId) => {
            // Check if response already exists
            const existingResponse = await QuizResponse.findOne({
                quizId: quiz._id,
                studentId,
            });

            if (existingResponse) {
                // Update status to Sent
                existingResponse.status = 'Sent';
                existingResponse.sentAt = Date.now();
                return await existingResponse.save();
            } else {
                // Create new response
                return await QuizResponse.create({
                    quizId: quiz._id,
                    studentId,
                    status: 'Sent',
                    sentAt: Date.now(),
                });
            }
        })
    );

    // TODO: Send email notifications to students

    res.json({
        success: true,
        message: `Quiz sent to ${responses.length} students`,
        data: responses,
    });
});

// @desc    Get quiz statistics
// @route   GET /api/quizzes/:id/stats
// @access  Private/Admin
const getQuizStats = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
    }

    const totalResponses = await QuizResponse.countDocuments({ quizId: quiz._id });
    const completedResponses = await QuizResponse.countDocuments({
        quizId: quiz._id,
        status: 'Completed',
    });
    const pendingResponses = await QuizResponse.countDocuments({
        quizId: quiz._id,
        status: 'Pending Quiz',
    });
    const sentResponses = await QuizResponse.countDocuments({
        quizId: quiz._id,
        status: 'Sent',
    });

    // Calculate average score
    const completedWithScores = await QuizResponse.find({
        quizId: quiz._id,
        status: 'Completed',
        score: { $exists: true },
    });

    const averageScore = completedWithScores.length > 0
        ? completedWithScores.reduce((sum, r) => sum + r.score, 0) / completedWithScores.length
        : 0;

    res.json({
        success: true,
        data: {
            quiz: {
                id: quiz._id,
                title: quiz.title,
            },
            stats: {
                totalResponses,
                completedResponses,
                pendingResponses,
                sentResponses,
                averageScore: averageScore.toFixed(2),
            },
        },
    });
});

module.exports = {
    getQuizzes,
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    sendQuiz,
    getQuizStats,
};
