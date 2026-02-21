const express = require('express');
const router = express.Router();
const { completeProblem, getCompletedProblems } = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/complete-problem', protect, completeProblem);
router.get('/completed-problems', protect, getCompletedProblems);

module.exports = router;
