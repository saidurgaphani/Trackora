const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional until assigned
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
    scheduledAt: { type: Date },
    status: { type: String, enum: ['requested', 'approved', 'completed'], default: 'requested' },
    feedback: { type: String },
    score: { type: Number, min: 0, max: 10 }
}, { timestamps: true });

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
