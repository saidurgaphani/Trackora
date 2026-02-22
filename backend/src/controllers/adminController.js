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

        if (req.body.targetCount) {
            // Recalculate status based on new target count
            await GoalAssignment.updateMany(
                { goalId: goal._id, progress: { $gte: req.body.targetCount } },
                { $set: { status: 'completed', completedAt: new Date() } }
            );
            await GoalAssignment.updateMany(
                { goalId: goal._id, progress: { $lt: req.body.targetCount } },
                { $set: { status: 'pending', completedAt: null } }
            );
        }

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

        await GoalAssignment.deleteMany({ goalId: goal._id });
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

            let readiness = 'Low';
            if (count > 50) readiness = 'Moderate';
            if (count > 100) readiness = 'High';
            if (count > 200) readiness = 'Placement Ready';

            return {
                ...student,
                score: Math.min(count, 100),
                totalActivity: count,
                readiness
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

        const { timeFrame = 'weekly', startDate, endDate } = req.query;

        let dateFrom = new Date();
        let dateTo = new Date();
        dateTo.setHours(23, 59, 59, 999);

        const barChartMap = {};
        let labelFormat = 'daily';

        if (timeFrame === 'weekly') {
            dateFrom.setDate(dateFrom.getDate() - 6);
            dateFrom.setHours(0, 0, 0, 0);

            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                barChartMap[dateStr] = { name: dayName, coding: 0, aptitude: 0, core: 0, softskills: 0 };
            }
        } else if (timeFrame === 'monthly') {
            dateFrom.setDate(dateFrom.getDate() - 29);
            dateFrom.setHours(0, 0, 0, 0);

            for (let i = 29; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const dayName = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                barChartMap[dateStr] = { name: dayName, coding: 0, aptitude: 0, core: 0, softskills: 0 };
            }
        } else if (timeFrame === 'yearly') {
            dateFrom.setMonth(dateFrom.getMonth() - 11);
            dateFrom.setDate(1);
            dateFrom.setHours(0, 0, 0, 0);
            labelFormat = 'monthly';

            for (let i = 11; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const valStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                const monthName = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                barChartMap[valStr] = { name: monthName, coding: 0, aptitude: 0, core: 0, softskills: 0 };
            }
        } else if (timeFrame === 'custom') {
            if (startDate) {
                dateFrom = new Date(startDate);
                dateFrom.setHours(0, 0, 0, 0);
            }
            if (endDate) {
                dateTo = new Date(endDate);
                dateTo.setHours(23, 59, 59, 999);
            }

            const diffDays = Math.ceil(Math.abs(dateTo - dateFrom) / (1000 * 60 * 60 * 24));
            if (diffDays > 90) {
                labelFormat = 'monthly';
                let currMonth = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), 1);
                while (currMonth <= dateTo) {
                    const valStr = `${currMonth.getFullYear()}-${String(currMonth.getMonth() + 1).padStart(2, '0')}`;
                    const monthName = currMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                    barChartMap[valStr] = { name: monthName, coding: 0, aptitude: 0, core: 0, softskills: 0 };
                    currMonth.setMonth(currMonth.getMonth() + 1);
                }
            } else {
                let currDate = new Date(dateFrom);
                while (currDate <= dateTo) {
                    const dateStr = currDate.toISOString().split('T')[0];
                    const dayName = currDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    barChartMap[dateStr] = { name: dayName, coding: 0, aptitude: 0, core: 0, softskills: 0 };
                    currDate.setDate(currDate.getDate() + 1);
                }
            }
        }

        const recentActivities = await Activity.find({
            collegeId: collId,
            loggedDate: { $gte: dateFrom, $lte: dateTo }
        });

        for (const act of recentActivities) {
            if (!act.loggedDate) continue;
            let keyStr = "";
            const actDate = new Date(act.loggedDate);
            if (labelFormat === 'daily') {
                keyStr = actDate.toISOString().split('T')[0];
            } else {
                keyStr = `${actDate.getFullYear()}-${String(actDate.getMonth() + 1).padStart(2, '0')}`;
            }

            if (barChartMap[keyStr]) {
                const cat = act.category || 'coding';
                if (barChartMap[keyStr][cat] !== undefined) {
                    barChartMap[keyStr][cat] += act.count || 0;
                }
            }
        }

        const barChartData = Object.values(barChartMap);

        res.json({
            totalStudents,
            activeStudents,
            inactiveStudents: totalStudents - activeStudents,
            totalActivitiesRecorded: totalActivities,
            averageActivitiesPerStudent: totalStudents > 0 ? (totalActivities / totalStudents).toFixed(2) : 0,
            topPerformers,
            barChartData
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
