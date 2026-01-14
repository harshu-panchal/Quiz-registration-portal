const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Quiz = require('../models/Quiz');
const QuizResponse = require('../models/QuizResponse');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardAnalytics = asyncHandler(async (req, res) => {
    // Total students
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'Active' });
    const pendingStudents = await Student.countDocuments({ status: 'Pending' });

    // Total quizzes
    const totalQuizzes = await Quiz.countDocuments();
    const activeQuizzes = await Quiz.countDocuments({ status: 'Active' });

    // Quiz responses
    const totalQuizzesSent = await QuizResponse.countDocuments({ status: { $in: ['Sent', 'Completed'] } });
    const pendingResponses = await QuizResponse.countDocuments({ status: 'Sent' });
    const completedResponses = await QuizResponse.countDocuments({ status: 'Completed' });

    // Calculate percentage changes (mock data for now)
    const studentChange = '+12%';
    const quizSentChange = '+5%';
    const pendingChange = '-2%';

    res.json({
        success: true,
        data: {
            students: {
                total: totalStudents,
                active: activeStudents,
                pending: pendingStudents,
                change: studentChange,
            },
            quizzes: {
                total: totalQuizzes,
                active: activeQuizzes,
                sent: totalQuizzesSent,
                change: quizSentChange,
            },
            responses: {
                pending: pendingResponses,
                completed: completedResponses,
                change: pendingChange,
            },
        },
    });
});

// @desc    Get student statistics
// @route   GET /api/analytics/students
// @access  Private/Admin
const getStudentStats = asyncHandler(async (req, res) => {
    const totalStudents = await Student.countDocuments();

    // Group by status
    const statusBreakdown = await Student.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);

    // Group by school
    const schoolBreakdown = await Student.aggregate([
        {
            $group: {
                _id: '$school',
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
    ]);

    // Group by class
    const classBreakdown = await Student.aggregate([
        {
            $group: {
                _id: '$class',
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
    ]);

    res.json({
        success: true,
        data: {
            total: totalStudents,
            byStatus: statusBreakdown,
            bySchool: schoolBreakdown,
            byClass: classBreakdown,
        },
    });
});

// @desc    Get quiz statistics
// @route   GET /api/analytics/quizzes
// @access  Private/Admin
const getQuizStats = asyncHandler(async (req, res) => {
    const totalQuizzes = await Quiz.countDocuments();

    // Group by status
    const statusBreakdown = await Quiz.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);

    // Group by category
    const categoryBreakdown = await Quiz.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
            },
        },
    ]);

    // Most popular quizzes (by response count)
    const quizzes = await Quiz.find().limit(10);
    const popularQuizzes = await Promise.all(
        quizzes.map(async (quiz) => {
            const responseCount = await QuizResponse.countDocuments({ quizId: quiz._id });
            return {
                id: quiz._id,
                title: quiz.title,
                category: quiz.category,
                responses: responseCount,
            };
        })
    );

    popularQuizzes.sort((a, b) => b.responses - a.responses);

    res.json({
        success: true,
        data: {
            total: totalQuizzes,
            byStatus: statusBreakdown,
            byCategory: categoryBreakdown,
            popular: popularQuizzes.slice(0, 5),
        },
    });
});

module.exports = {
    getDashboardAnalytics,
    getStudentStats,
    getQuizStats,
};
