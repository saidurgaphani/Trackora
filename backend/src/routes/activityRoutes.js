const express = require('express');
const { logActivity, getMyActivities, getActivitySummary, getActivityTrends } = require('../controllers/activityController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, logActivity);
router.get('/me', protect, getMyActivities);
router.get('/summary', protect, getActivitySummary);
router.get('/trends', protect, getActivityTrends);

module.exports = router;
