const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUid: { type: String, unique: true, required: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'admin', 'trainer'], default: 'student' },
    profile: {
        branch: { type: String },
        year: { type: Number },
        rollNo: { type: String }
    },
    completedProblems: {
        type: Map,
        of: [String],
        default: {
            coding: [],
            aptitude: [],
            softskills: []
        }
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Indexes for optimization
userSchema.index({ collegeId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ collegeId: 1, role: 1 });

module.exports = mongoose.model('User', userSchema);
