const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin
    title: { type: String, required: true },
    category: { type: String, required: true },
    targetCount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
