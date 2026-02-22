const express = require('express');
const router = express.Router();
const { completeProblem, uncompleteProblem, getCompletedProblems } = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/complete-problem', protect, completeProblem);
router.post('/uncomplete-problem', protect, uncompleteProblem);
router.get('/completed-problems', protect, getCompletedProblems);

module.exports = router;
