const Goal = require('../models/Goal');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc Create a goal
// @route POST /api/admin/goals
// @access Protected (Admin/Trainer)
const createGoal = async (req, res) => {
    try {
        const { title, category, targetCount, startDate, deadline, isActive } = req.body;

        const goal = await Goal.create({
            collegeId: req.user.collegeId,
            createdBy: req.user._id,
            title,
            category,
            targetCount,
            startDate,
            deadline,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
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
        // Only fetch students from the admin's college
        const students = await User.find({ role: 'student', collegeId: req.user.collegeId }).select('-password');
        res.json(students);
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
        const student = await User.findOne({ _id: studentId, collegeId: req.user.collegeId });

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

        // Very simple average activity per user approximation
        const totalActivities = await Activity.countDocuments({ collegeId: collId });

        res.json({
            totalStudents,
            activeStudents,
            inactiveStudents: totalStudents - activeStudents,
            totalActivitiesRecorded: totalActivities,
            averageActivitiesPerStudent: totalStudents > 0 ? (totalActivities / totalStudents).toFixed(2) : 0
        });
    } catch (error) {
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
