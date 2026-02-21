const Activity = require('../models/Activity');

// @desc Log daily activity
// @route POST /api/activities
// @access Protected
const logActivity = async (req, res) => {
    try {
        const { category, subCategory, count, durationMinutes, source } = req.body;

        // Validate category
        const validCategories = ['coding', 'aptitude', 'core', 'softskills'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const activity = await Activity.create({
            userId: req.user._id,
            collegeId: req.user.collegeId,
            category,
            subCategory,
            count: count || 1,
            durationMinutes: durationMinutes || 0,
            source
        });

        res.status(201).json(activity);
    } catch (error) {
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

module.exports = { logActivity, getMyActivities, getActivitySummary };
