const express = require('express');
const { getCategoryProgress, getStreak, getReadinessScore } = require('../controllers/progressController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/category', protect, getCategoryProgress);
router.get('/streak', protect, getStreak);
router.get('/readiness', protect, getReadinessScore);

module.exports = router;
