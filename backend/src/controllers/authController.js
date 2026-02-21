const User = require('../models/User');
const College = require('../models/College');
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
        const { email } = req.body;

        // In a real scenario we might verify the firebase token first
        const user = await User.findOne({ email });

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
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
