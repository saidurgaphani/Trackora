const User = require('../models/User');
const College = require('../models/College');
const Goal = require('../models/Goal');
const GoalAssignment = require('../models/GoalAssignment');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register user
// @route POST /api/auth/register
// @access Public
const register = async (req, res) => {
    try {
        const { name, email, firebaseUid, collegeId, role } = req.body;

        let colId = collegeId;
        if (!colId) {
            let college = await College.findOne({ name: 'Default College' });
            if (!college) {
                college = await College.create({ name: 'Default College', location: 'Internet' });
            }
            colId = college._id;
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            firebaseUid: firebaseUid || `mock-uid-${Date.now()}`,
            collegeId: colId,
            role: role || 'student',
        });

        // Auto-assign existing active goals if this is a student
        if (user.role === 'student') {
            const activeGoals = await Goal.find({ collegeId: colId, isActive: true });
            if (activeGoals.length > 0) {
                const assignments = activeGoals.map(goal => ({
                    goalId: goal._id,
                    studentId: user._id,
                    status: 'pending',
                    progress: 0
                }));
                await GoalAssignment.insertMany(assignments);
                console.log(`Auto-assigned ${activeGoals.length} goals to new student ${user.email}`);
            }
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Login & return JWT
// @route POST /api/auth/login
// @access Public
const login = async (req, res) => {
    try {
        const { email, firebaseUid, name, role } = req.body;
        console.log(`Login attempt for: ${email} with requested role: ${role}`);

        // Find user by email
        let user = await User.findOne({ email });

        // If user doesn't exist in MongoDB but we have Firebase info (auto-sync)
        if (!user && firebaseUid) {
            let college = await College.findOne({ name: 'Default College' });
            if (!college) {
                college = await College.create({ name: 'Default College', location: 'Internet' });
            }

            user = await User.create({
                name: name || email.split('@')[0],
                email,
                firebaseUid,
                collegeId: college._id,
                role: role || 'student'
            });
            console.log(`Created new user with role: ${user.role}`);

            // Auto-assign existing active goals if this is a student
            if (user.role === 'student') {
                const activeGoals = await Goal.find({ collegeId: college._id, isActive: true });
                if (activeGoals.length > 0) {
                    const assignments = activeGoals.map(goal => ({
                        goalId: goal._id,
                        studentId: user._id,
                        status: 'pending',
                        progress: 0
                    }));
                    await GoalAssignment.insertMany(assignments);
                    console.log(`Auto-assigned ${activeGoals.length} goals to new student ${user.email}`);
                }
            }
        } else if (user) {
            // Update firebaseUid if it was missing or if role needs syncing
            let updated = false;
            if (role && user.role !== role) {
                console.log(`Updating role for ${email} from ${user.role} to ${role}`);
                user.role = role;
                updated = true;
            }
            if (!user.firebaseUid && firebaseUid) {
                user.firebaseUid = firebaseUid;
                updated = true;
            }
            if (updated) await user.save();
        }

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials. User not found in system.' });
        }
    } catch (error) {
        console.error("Login Controller Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Get logged-in user profile
// @route GET /api/auth/profile
// @access Protected
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('collegeId', 'name location');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { register, login, getProfile };
