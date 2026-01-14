const express = require('express');
const {
    register,
    login,
    adminLogin,
    getMe,
    logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
