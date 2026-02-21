const mongoose = require('mongoose');

const goalAssignmentSchema = new mongoose.Schema({
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    progress: { type: Number, default: 0 },
    completedAt: { type: Date }
}, { timestamps: true });

goalAssignmentSchema.index({ goalId: 1, studentId: 1 }, { unique: true });
goalAssignmentSchema.index({ studentId: 1, status: 1 });

module.exports = mongoose.model('GoalAssignment', goalAssignmentSchema);
