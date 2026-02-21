const express = require('express');
const {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
    getStudents,
    getStudentProgress,
    getAnalytics
} = require('../controllers/adminController');
const { protect, adminOrTrainer } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/goals', protect, adminOrTrainer, createGoal);
router.get('/goals', protect, adminOrTrainer, getGoals);
router.put('/goals/:id', protect, adminOrTrainer, updateGoal);
router.delete('/goals/:id', protect, adminOrTrainer, deleteGoal);

router.get('/students', protect, adminOrTrainer, getStudents);
router.get('/student/:id', protect, adminOrTrainer, getStudentProgress);

router.get('/analytics', protect, adminOrTrainer, getAnalytics);

module.exports = router;
