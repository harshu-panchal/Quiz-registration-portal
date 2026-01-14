const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');

// @desc    Get all transactions (Admin)
// @route   GET /api/transactions
// @access  Private/Admin
const getTransactions = asyncHandler(async (req, res) => {
    const { type, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (type && type !== 'All') {
        query.type = type;
    }

    if (search) {
        query.$or = [
            { source: { $regex: search, $options: 'i' } },
            { transactionId: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Transaction.countDocuments(query);

    // Calculate Stats
    const totalBalance = await Transaction.aggregate([
        { $match: { status: 'Completed', type: 'Income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalPayouts = await Transaction.aggregate([
        { $match: { status: 'Completed', type: 'Payout' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Monthly Income (Current Month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyIncome = await Transaction.aggregate([
        {
            $match: {
                status: 'Completed',
                type: 'Income',
                createdAt: { $gte: firstDay }
            }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Revenue Trend (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueTrend = await Transaction.aggregate([
        {
            $match: {
                status: 'Completed',
                type: 'Income',
                createdAt: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                revenue: { $sum: "$amount" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedTrend = revenueTrend.map(item => ({
        month: months[item._id - 1],
        revenue: item.revenue
    }));

    res.json({
        success: true,
        data: transactions,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
        },
        stats: {
            totalBalance: totalBalance[0]?.total || 0,
            totalPayouts: totalPayouts[0]?.total || 0,
            monthlyIncome: monthlyIncome[0]?.total || 0,
            revenueTrend: formattedTrend
        }
    });
});

module.exports = {
    getTransactions,
};
