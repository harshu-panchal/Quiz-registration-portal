const express = require('express');
const {
    getQuizzes,
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    sendQuiz,
    getQuizStats,
} = require('../controllers/quizController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
    .get(getQuizzes)
    .post(admin, createQuiz);

router.route('/:id')
    .get(getQuiz)
    .put(admin, updateQuiz)
    .delete(admin, deleteQuiz);

router.post('/:id/send', admin, sendQuiz);
router.get('/:id/stats', admin, getQuizStats);

module.exports = router;
