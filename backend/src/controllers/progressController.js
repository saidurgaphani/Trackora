const Activity = require('../models/Activity');
const ReadinessSnapshot = require('../models/ReadinessSnapshot');
const GoalAssignment = require('../models/GoalAssignment');
const Goal = require('../models/Goal');

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

// @desc Get current active goals for the student
// @route GET /api/progress/goals
// @access Protected
const getActiveGoals = async (req, res) => {
    try {
        let goals = await GoalAssignment.find({ studentId: req.user._id })
            .populate('goalId')
            .sort({ createdAt: -1 });

        // If no goals assigned, check for active goals in their college to proactively assign
        // This handles students who joined after goals were created or missed auto-assignment
        const activeGoalsInCollege = await Goal.find({
            collegeId: req.user.collegeId,
            isActive: true
        });

        const assignedGoalIds = goals.map(g => g.goalId?._id?.toString());
        const missingGoals = activeGoalsInCollege.filter(g => !assignedGoalIds.includes(g._id.toString()));

        if (missingGoals.length > 0) {
            const newAssignments = missingGoals.map(goal => ({
                goalId: goal._id,
                studentId: req.user._id,
                status: 'pending',
                progress: 0
            }));
            await GoalAssignment.insertMany(newAssignments);

            // Re-fetch to include new assignments
            goals = await GoalAssignment.find({ studentId: req.user._id })
                .populate('goalId')
                .sort({ createdAt: -1 });
        }

        // Filter out inactive goals or goals that were deleted
        goals = goals.filter(g => g.goalId && g.goalId.isActive);

        res.json(goals);
    } catch (error) {
        console.error("getActiveGoals Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getCategoryProgress, getStreak, getReadinessScore, getActiveGoals };
