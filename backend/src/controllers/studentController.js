const User = require('../models/User');
const Activity = require('../models/Activity');
const GoalAssignment = require('../models/GoalAssignment');

// @desc Mark a practice problem as done
// @route POST /api/students/complete-problem
// @access Protected
const completeProblem = async (req, res) => {
    try {
        const { problemId, problemTitle, topicTitle, category = 'coding' } = req.body;

        if (!problemId) {
            return res.status(400).json({ message: 'Problem ID is required' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // EXTREMELY ROBUST INITIALIZATION: Handle transition from old Array schema to new Map schema
        if (!user.completedProblems || typeof user.completedProblems.get !== 'function') {
            const oldData = Array.isArray(user.completedProblems) ? user.completedProblems : [];
            user.completedProblems = new Map([
                ['coding', oldData],
                ['aptitude', []],
                ['softskills', []]
            ]);
        }

        const currentCompleted = user.completedProblems.get(category) || [];

        // Check if already completed in that category
        if (currentCompleted.includes(problemId)) {
            return res.status(400).json({ message: 'Item already marked as done' });
        }

        // Add to completed list for that category
        currentCompleted.push(problemId);
        user.completedProblems.set(category, currentCompleted);

        // Force mongoose to recognize the change in the Map
        user.markModified('completedProblems');
        await user.save();

        // Calculate total count across all categories accurately
        let totalCompleted = 0;
        if (user.completedProblems instanceof Map) {
            user.completedProblems.forEach(list => totalCompleted += (list?.length || 0));
        } else {
            Object.values(user.completedProblems).forEach(list => totalCompleted += (list?.length || 0));
        }

        // Log an activity
        const activity = await Activity.create({
            userId: req.user._id,
            collegeId: req.user.collegeId,
            category: category,
            subCategory: `${topicTitle}: ${problemTitle}`,
            count: 1,
            source: 'Practice Page'
        });

        // Update active Goal Assignments
        const updatedAssignments = await GoalAssignment.find({
            studentId: req.user._id,
            status: 'pending'
        }).populate('goalId');

        for (const assignment of updatedAssignments) {
            if (assignment.goalId && assignment.goalId.category === category) {
                assignment.progress += 1;
                if (assignment.progress >= assignment.goalId.targetCount) {
                    assignment.status = 'completed';
                    assignment.completedAt = new Date();
                }
                await assignment.save();
            }
        }

        res.json({
            message: 'Problem marked as done',
            completedProblemsCount: totalCompleted,
            activity
        });
    } catch (error) {
        console.error("Complete Problem Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Get student's completed problems
// @route GET /api/students/completed-problems
// @access Protected
const getCompletedProblems = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('completedProblems');
        const completed = user.completedProblems ? Object.fromEntries(user.completedProblems) : { coding: [], aptitude: [], softskills: [] };
        res.json(completed);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { completeProblem, getCompletedProblems };
