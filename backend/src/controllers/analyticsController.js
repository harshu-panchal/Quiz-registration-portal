const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Quiz = require('../models/Quiz');
const QuizResponse = require('../models/QuizResponse');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardAnalytics = asyncHandler(async (req, res) => {
    const { dateRange } = req.query;

    let startDate = new Date();
    // Default to Last 30 Days if not specified
    startDate.setDate(startDate.getDate() - 30);

    if (dateRange === 'Last 7 Days') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
    } else if (dateRange === 'Last 90 Days') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);
    } else if (dateRange === 'All Time') {
        startDate = new Date(0); // Epoch
    }

    // 1. Stats Cards
    const totalStudents = await Student.countDocuments();
    // Previous period for trend calculation (approximate)
    const previousPeriodDate = new Date();
    previousPeriodDate.setDate(previousPeriodDate.getDate() - 60); // Compare with prev 30 days
    const prevStudents = await Student.countDocuments({ createdAt: { $lt: startDate } });
    const studentGrowth = prevStudents === 0 ? 100 : Math.round(((totalStudents - prevStudents) / prevStudents) * 100);

    // Quiz Stats
    const totalResponses = await QuizResponse.countDocuments({ status: 'Completed' });
    const avgScoreResult = await QuizResponse.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: null, avg: { $avg: "$score" } } }
    ]);
    const avgScore = avgScoreResult[0]?.avg ? Math.round(avgScoreResult[0].avg) : 0;

    // Completion Rate (Completed / (Sent + Completed))
    const totalSent = await QuizResponse.countDocuments({ status: { $in: ['Sent', 'Completed'] } });
    const completionRate = totalSent === 0 ? 0 : Math.round((totalResponses / totalSent) * 100);

    // 2. Registration Growth Chart (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyGrowth = await Student.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyGrowth = monthlyGrowth.map(item => ({
        name: months[item._id - 1],
        students: item.count
    }));

    // Weekly Growth (Last 4 Weeks)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const weeklyGrowth = await Student.aggregate([
        { $match: { createdAt: { $gte: fourWeeksAgo } } },
        {
            $group: {
                _id: { $week: "$createdAt" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);
    const formattedWeeklyGrowth = weeklyGrowth.map((item, index) => ({
        name: `Week ${index + 1}`,
        students: item.count
    }));


    // 3. Quiz Performance Distribution
    const performanceDistribution = await QuizResponse.aggregate([
        { $match: { status: 'Completed' } },
        {
            $group: {
                _id: {
                    $switch: {
                        branches: [
                            { case: { $gte: ["$score", 90] }, then: "High Scores (90+)" },
                            { case: { $gte: ["$score", 70] }, then: "Average (70-89)" },
                            { case: { $gte: ["$score", 50] }, then: "Passing (50-69)" },
                        ],
                        default: "Below Avg"
                    }
                },
                value: { $sum: 1 }
            }
        }
    ]);

    const colors = {
        "High Scores (90+)": "#22c55e", // Green
        "Average (70-89)": "#3b82f6", // Blue
        "Passing (50-69)": "#f97316", // Orange
        "Below Avg": "#ef4444" // Red
    };

    const formattedPerformance = performanceDistribution.map(item => ({
        name: item._id,
        value: item.value,
        color: colors[item._id] || "#cbd5e1"
    }));

    // 4. Recent Activity (Mocking from Transactions/Students for now)
    // In a real app, you'd have a system log or merge multiple collection streams
    const recentStudents = await Student.find().sort({ createdAt: -1 }).limit(5);
    const recentActivity = recentStudents.map(s => ({
        action: "New student registration",
        target: s.name,
        time: s.createdAt,
        type: "registration"
    }));

    res.json({
        success: true,
        data: {
            stats: [
                {
                    label: "Total Students",
                    value: totalStudents.toString(),
                    trend: `${studentGrowth > 0 ? '+' : ''}${studentGrowth}%`,
                    isPositive: studentGrowth >= 0,
                    icon: "Users",
                    bgColor: "bg-blue-50",
                    textColor: "text-blue-600",
                },
                {
                    label: "Quiz Completion Rate",
                    value: `${completionRate}%`,
                    trend: "+0%", // Needs historical data for real trend
                    isPositive: true,
                    icon: "Award",
                    bgColor: "bg-green-50",
                    textColor: "text-green-600",
                },
                {
                    label: "Avg. Test Score",
                    value: `${avgScore}/100`,
                    trend: "+0%",
                    isPositive: true,
                    icon: "Activity",
                    bgColor: "bg-orange-50",
                    textColor: "text-orange-600",
                },
            ],
            // Added for AdminDashboard.jsx
            students: {
                total: totalStudents.toString(),
                change: `${studentGrowth > 0 ? '+' : ''}${studentGrowth}%`
            },
            quizzes: {
                sent: totalSent.toString(),
                change: "+0%" // Placeholder
            },
            responses: {
                pending: (totalSent - totalResponses).toString(),
                change: "+0%" // Placeholder
            },
            monthlyGrowth: formattedMonthlyGrowth,
            weeklyGrowth: formattedWeeklyGrowth,
            performance: formattedPerformance,
            recentActivity: recentActivity
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
