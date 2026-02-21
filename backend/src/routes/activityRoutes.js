const express = require('express');
const { logActivity, getMyActivities, getActivitySummary } = require('../controllers/activityController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, logActivity);
router.get('/me', protect, getMyActivities);
router.get('/summary', protect, getActivitySummary);

module.exports = router;
