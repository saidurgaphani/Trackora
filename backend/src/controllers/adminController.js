const Goal = require('../models/Goal');
const GoalAssignment = require('../models/GoalAssignment');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc Create a goal and assign it to students
// @route POST /api/admin/goals
// @access Protected (Admin/Trainer)
const createGoal = async (req, res) => {
    try {
        const { title, category, targetCount, startDate, deadline, isActive } = req.body;
        console.log(`Publishing Goal: ${title} for college ${req.user.collegeId}`);

        if (!title) return res.status(400).json({ message: 'Title is required' });

        const normalizedCategory = category ? category.toLowerCase() : 'coding';

        const goal = await Goal.create({
            collegeId: req.user.collegeId,
            createdBy: req.user._id,
            title,
            category: normalizedCategory,
            targetCount: Number(targetCount) || 10,
            startDate: startDate || new Date(),
            deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            isActive: isActive !== undefined ? isActive : true
        });

        // Auto-assign to all students in current college
        if (req.user.collegeId) {
            const students = await User.find({ collegeId: req.user.collegeId, role: 'student' });
            if (students.length > 0) {
                const assignments = students.map(student => ({
                    goalId: goal._id,
                    studentId: student._id,
                    status: 'pending',
                    progress: 0
                }));
                await GoalAssignment.insertMany(assignments);
                console.log(`Goal assigned to ${students.length} students.`);
            }
        }

        res.status(201).json(goal);
    } catch (error) {
        console.error("Error creating goal:", error);
        res.status(500).json({ message: 'Server Side Error', error: error.message });
    }
};

// @desc Get all goals
// @route GET /api/admin/goals
// @access Protected (Admin/Trainer)
const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ collegeId: req.user.collegeId });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Update goal
// @route PUT /api/admin/goals/:id
// @access Protected (Admin/Trainer)
const updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.collegeId.toString() !== req.user.collegeId.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this goal' });
        }

        const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedGoal);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Delete goal
// @route DELETE /api/admin/goals/:id
// @access Protected (Admin/Trainer)
const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.collegeId.toString() !== req.user.collegeId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this goal' });
        }

        await Goal.deleteOne({ _id: req.params.id });
        res.json({ message: 'Goal removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Get all students
// @route GET /api/admin/students
// @access Protected (Admin/Trainer)
const getStudents = async (req, res) => {
    try {
        const collId = req.user.collegeId;
        // Fetch students
        const students = await User.find({ role: 'student', collegeId: collId }).select('-password').lean();

        // Get activity counts for all these students in parallel
        const enrichedStudents = await Promise.all(students.map(async (student) => {
            const activities = await Activity.aggregate([
                { $match: { userId: student._id } },
                { $group: { _id: null, total: { $sum: "$count" } } }
            ]);

            // For demo purposes, we treat total count as score (clamped at 100 for percentage feel)
            const count = activities.length > 0 ? activities[0].total : 0;
            return {
                ...student,
                score: Math.min(count, 100),
                totalActivity: count
            };
        }));

        res.json(enrichedStudents);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Get individual student progress
// @route GET /api/admin/student/:id
// @access Protected (Admin/Trainer)
const getStudentProgress = async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await User.findOne({ _id: studentId, collegeId: req.user.collegeId }).lean();

        if (!student) {
            return res.status(404).json({ message: 'Student not found in your college' });
        }

        // Aggregate their activities
        const summary = await Activity.aggregate([
            { $match: { userId: student._id } },
            { $group: { _id: "$category", totalCount: { $sum: "$count" }, totalDuration: { $sum: "$durationMinutes" } } }
        ]);

        res.json({
            student,
            progress: summary
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Get overall analytics
// @route GET /api/admin/analytics
// @access Protected (Admin/Trainer)
const getAnalytics = async (req, res) => {
    try {
        const collId = req.user.collegeId;

        const totalStudents = await User.countDocuments({ role: 'student', collegeId: collId });
        const activeStudents = await User.countDocuments({ role: 'student', collegeId: collId, isActive: true });
        const totalActivities = await Activity.countDocuments({ collegeId: collId });

        // Get Top 5 Performers
        const topPerformersData = await Activity.aggregate([
            { $match: { collegeId: collId } },
            { $group: { _id: "$userId", totalCount: { $sum: "$count" } } },
            { $sort: { totalCount: -1 } },
            { $limit: 5 }
        ]);

        const topPerformers = await Promise.all(topPerformersData.map(async (p) => {
            const user = await User.findById(p._id).select('name profile email');
            return {
                _id: p._id,
                name: user?.name || 'Unknown',
                branch: user?.profile?.branch || 'N/A',
                score: Math.min(p.totalCount, 100)
            };
        }));

        res.json({
            totalStudents,
            activeStudents,
            inactiveStudents: totalStudents - activeStudents,
            totalActivitiesRecorded: totalActivities,
            averageActivitiesPerStudent: totalStudents > 0 ? (totalActivities / totalStudents).toFixed(2) : 0,
            topPerformers
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
    getStudents,
    getStudentProgress,
    getAnalytics
};
