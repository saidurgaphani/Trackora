const MockInterview = require('../models/MockInterview');
const Activity = require('../models/Activity'); // To re-check score here

// @desc Check eligibility based on readiness score
// @route GET /api/mock/eligibility
// @access Protected
const checkEligibility = async (req, res) => {
    try {
        const summary = await Activity.aggregate([
            { $match: { userId: req.user._id } },
            { $group: { _id: null, totalScore: { $sum: "$count" } } }
        ]);

        let totalScore = summary.length > 0 ? summary[0].totalScore : 0;

        // threshold mock logic: Need sum of activities count > 100 to be eligible
        let isEligible = totalScore > 100;

        res.json({
            isEligible,
            currentScore: totalScore,
            threshold: 100
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Request mock interview
// @route POST /api/mock/schedule
// @access Protected
const scheduleMockInterview = async (req, res) => {
    try {
        const { scheduledDate } = req.body;

        // Should verify eligibility again in real world
        const newRequest = await MockInterview.create({
            studentId: req.user._id,
            collegeId: req.user.collegeId,
            scheduledAt: scheduledDate,
            status: 'requested'
        });

        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { checkEligibility, scheduleMockInterview };
