const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getTransactions } = require('../controllers/transactionController');

router.get('/', protect, admin, getTransactions);

module.exports = router;
