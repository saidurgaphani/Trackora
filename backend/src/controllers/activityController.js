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

        const validCategories = ['coding', 'aptitude', 'core', 'softskills'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                message: `Invalid category: '${category}'. Supported: ${validCategories.join(', ')}`
            });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let activity = await Activity.findOne({
            userId: req.user._id,
            category: category,
            loggedDate: { $gte: startOfDay, $lte: endOfDay }
        });

        const newCount = Number(count) || 1;
        const newDuration = Number(durationMinutes) || 0;

        if (activity) {
            // Update existing card for the day
            activity.count += newCount;
            activity.durationMinutes += newDuration;

            // Append subcategory if it's new
            if (subCategory && !activity.subCategory.includes(subCategory)) {
                // To prevent title from getting excessively long, limit appends
                if (activity.subCategory.length < 60) {
                    activity.subCategory += ` | ${subCategory}`;
                } else if (!activity.subCategory.endsWith('...')) {
                    activity.subCategory += '...';
                }
            }
            await activity.save();
        } else {
            // Create new card
            activity = await Activity.create({
                userId: req.user._id,
                collegeId: req.user.collegeId,
                category,
                subCategory: subCategory || category,
                count: newCount,
                durationMinutes: newDuration,
                source: source || 'Manual Log'
            });
        }

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

// @desc Update activity
// @route PUT /api/activities/:id
// @access Protected
const updateActivity = async (req, res) => {
    try {
        console.log(`[Activity] Updating ${req.params.id} for user ${req.user._id}`);
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        if (activity.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const oldCategory = activity.category;
        const oldCount = activity.count;
        const { category, subCategory, count, durationMinutes, source } = req.body;

        activity.category = (category || activity.category).toLowerCase();
        activity.subCategory = subCategory || activity.subCategory;
        activity.count = count !== undefined ? Number(count) : activity.count;
        activity.durationMinutes = durationMinutes !== undefined ? Number(durationMinutes) : activity.durationMinutes;
        activity.source = source || activity.source;

        const updatedActivity = await activity.save();

        if (oldCategory !== activity.category || oldCount !== activity.count) {
            const assignments = await GoalAssignment.find({ studentId: req.user._id }).populate('goalId');
            for (const assignment of assignments) {
                if (assignment.goalId && assignment.goalId.category) {
                    let changed = false;
                    if (assignment.goalId.category === oldCategory) {
                        assignment.progress = Math.max(0, assignment.progress - oldCount);
                        if (assignment.progress < assignment.goalId.targetCount) {
                            assignment.status = 'pending';
                            assignment.completedAt = null;
                        }
                        changed = true;
                    }
                    if (assignment.goalId.category === activity.category) {
                        assignment.progress += activity.count;
                        if (assignment.progress >= assignment.goalId.targetCount) {
                            assignment.status = 'completed';
                            assignment.completedAt = new Date();
                        }
                        changed = true;
                    }
                    if (changed) await assignment.save();
                }
            }
        }
        res.json(updatedActivity);
    } catch (error) {
        console.error("Update activity error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Delete activity
// @route DELETE /api/activities/:id
// @access Protected
const deleteActivity = async (req, res) => {
    try {
        console.log(`[Activity] Deleting ${req.params.id} for user ${req.user._id}`);
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        if (activity.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const category = activity.category;
        const count = activity.count;

        await activity.deleteOne();

        const assignments = await GoalAssignment.find({ studentId: req.user._id }).populate('goalId');
        for (const assignment of assignments) {
            if (assignment.goalId && assignment.goalId.category === category) {
                assignment.progress = Math.max(0, assignment.progress - count);
                if (assignment.progress < assignment.goalId.targetCount) {
                    assignment.status = 'pending';
                    assignment.completedAt = null;
                }
                await assignment.save();
            }
        }

        res.json({ message: 'Activity removed' });
    } catch (error) {
        console.error("Delete activity error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { logActivity, getMyActivities, getActivitySummary, getActivityTrends, updateActivity, deleteActivity };
