const express = require('express');
const { getCategoryProgress, getStreak, getReadinessScore, getActiveGoals } = require('../controllers/progressController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/category', protect, getCategoryProgress);
router.get('/streak', protect, getStreak);
router.get('/readiness', protect, getReadinessScore);
router.get('/goals', protect, getActiveGoals);

module.exports = router;
