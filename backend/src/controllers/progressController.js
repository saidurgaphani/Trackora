const Activity = require('../models/Activity');
const ReadinessSnapshot = require('../models/ReadinessSnapshot');

// @desc Get category-wise performance
// @route GET /api/progress/category
// @access Protected
const getCategoryProgress = async (req, res) => {
    try {
        const summary = await Activity.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: "$category",
                    totalCount: { $sum: "$count" },
                    totalDuration: { $sum: "$durationMinutes" }
                }
            },
            {
                $project: {
                    category: "$_id",
                    totalCount: 1,
                    totalDuration: 1,
                    _id: 0
                }
            }
        ]);

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Get consistency/streak
// @route GET /api/progress/streak
// @access Protected
const getStreak = async (req, res) => {
    try {
        // Very simplified streak algorithm
        // 1. Get all unique dates of activities
        const activities = await Activity.find({ userId: req.user._id })
            .distinct('loggedDate');

        // Sort descending
        activities.sort((a, b) => b - a);

        let currentStreak = 0;

        // Quick approximation: just checking how many consecutive days back from today
        let checkDate = new Date();
        checkDate.setHours(0, 0, 0, 0);

        for (const actDate of activities) {
            const d = new Date(actDate);
            d.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(checkDate - d);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0 || diffDays === 1) {
                if (diffDays === 1 || currentStreak === 0) currentStreak++;
                checkDate = d;
            } else {
                break; // Streak broken
            }
        }

        res.json({ streak: currentStreak });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Calculate readiness score
// @route GET /api/progress/readiness
// @access Protected
const getReadinessScore = async (req, res) => {
    try {
        // Quick readiness calc: get latest snapshot or calc ad-hoc
        // We'll calculate ad-hoc for simplicity in this demo backend
        const summary = await Activity.aggregate([
            { $match: { userId: req.user._id } },
            { $group: { _id: "$category", totalScore: { $sum: "$count" } } }
        ]);

        let totalScore = 0;
        const details = { coding: 0, aptitude: 0, core: 0, softskills: 0 };

        summary.forEach(item => {
            details[item._id] = item.totalScore;
            totalScore += item.totalScore; // Basic sum for demo
        });

        let readinessLevel = 'Low';
        if (totalScore > 50) readinessLevel = 'Moderate';
        if (totalScore > 100) readinessLevel = 'High';
        if (totalScore > 200) readinessLevel = 'Placement Ready';

        res.json({
            readinessLevel,
            totalScore,
            details
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getCategoryProgress, getStreak, getReadinessScore };
