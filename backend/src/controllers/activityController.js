const Activity = require('../models/Activity');
const GoalAssignment = require('../models/GoalAssignment');

// @desc Log daily activity
// @route POST /api/activities
// @access Protected
const logActivity = async (req, res) => {
    try {
        let { category, subCategory, count, durationMinutes, source } = req.body;

        // Normalize category
        if (category) category = category.toLowerCase();

        // Validate category
        const validCategories = ['coding', 'aptitude', 'core', 'softskills'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                message: `Invalid category: '${category}'. Supported: ${validCategories.join(', ')}`
            });
        }

        const activity = await Activity.create({
            userId: req.user._id,
            collegeId: req.user.collegeId,
            category,
            subCategory,
            count: Number(count) || 1,
            durationMinutes: Number(durationMinutes) || 0,
            source
        });

        // Update active Goal Assignments for this user and category
        const updatedAssignments = await GoalAssignment.find({
            studentId: req.user._id,
            status: 'pending'
        }).populate('goalId');

        for (const assignment of updatedAssignments) {
            if (assignment.goalId && assignment.goalId.category === category) {
                assignment.progress += Number(count);

                // Check for completion
                if (assignment.progress >= assignment.goalId.targetCount) {
                    assignment.status = 'completed';
                    assignment.completedAt = new Date();
                }
                await assignment.save();
            }
        }

        res.status(201).json(activity);
    } catch (error) {
        console.error("Error logging activity:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Get current user's activities
// @route GET /api/activities/me
// @access Protected
const getMyActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ userId: req.user._id }).sort({ loggedDate: -1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Get summary of activities (weekly/monthly)
// @route GET /api/activities/summary?range=weekly
// @access Protected
const getActivitySummary = async (req, res) => {
    try {
        const { range } = req.query; // 'weekly' or 'monthly'
        let startDate = new Date();

        if (range === 'monthly') {
            startDate.setMonth(startDate.getMonth() - 1);
        } else {
            // Default to weekly
            startDate.setDate(startDate.getDate() - 7);
        }

        const summary = await Activity.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    loggedDate: { $gte: startDate }
                }
            },
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

// @desc Get activity trends for the last 7 days
// @route GET /api/activities/trends
// @access Protected
const getActivityTrends = async (req, res) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);

        const activities = await Activity.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    loggedDate: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$loggedDate" } },
                        category: "$category"
                    },
                    total: { $sum: "$count" }
                }
            }
        ]);

        const trends = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const dayData = {
                name: dayNames[d.getDay()],
                coding: 0,
                aptitude: 0,
                softskills: 0,
                core: 0
            };

            activities.forEach(act => {
                if (act._id.date === dateStr) {
                    dayData[act._id.category] = act.total;
                }
            });

            trends.push(dayData);
        }

        res.json(trends);
    } catch (error) {
        console.error("Trends Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { logActivity, getMyActivities, getActivitySummary, getActivityTrends };
