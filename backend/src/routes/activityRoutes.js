const express = require('express');
const { logActivity, getMyActivities, getActivitySummary, getActivityTrends, updateActivity, deleteActivity } = require('../controllers/activityController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, logActivity);
router.get('/me', protect, getMyActivities);
router.get('/summary', protect, getActivitySummary);
router.get('/trends', protect, getActivityTrends);
router.put('/:id', protect, updateActivity);
router.delete('/:id', protect, deleteActivity);

module.exports = router;
