const express = require('express');
const { checkEligibility, scheduleMockInterview } = require('../controllers/mockController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/eligibility', protect, checkEligibility);
router.post('/schedule', protect, scheduleMockInterview);

module.exports = router;
