const express = require('express');
const {
    getDashboardAnalytics,
    getStudentStats,
    getQuizStats,
} = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

router.get('/dashboard', getDashboardAnalytics);
router.get('/students', getStudentStats);
router.get('/quizzes', getQuizStats);

module.exports = router;
