const mongoose = require('mongoose');

const readinessSnapshotSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekStartDate: { type: Date, required: true },
    codingScore: { type: Number, default: 0 },
    aptitudeScore: { type: Number, default: 0 },
    coreScore: { type: Number, default: 0 },
    softSkillScore: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    readinessLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Placement Ready'], default: 'Low' }
}, { timestamps: true });

readinessSnapshotSchema.index({ studentId: 1, weekStartDate: -1 });

module.exports = mongoose.model('ReadinessSnapshot', readinessSnapshotSchema);
